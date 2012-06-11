require "pathname"
require "rubygems"
require "crxmake"
require "json"

class CrxPackager
  NAME      = Pathname.new(".").realpath.basename
  USER      = `git config github.user`.strip
  CODE_BASE = "https://github.com/#{USER}/#{NAME}/raw/master/pkg/#{NAME}.crx"
  APP_ID    = "joomeamaboggngeopjkflnocdghkglak"

  def self.build(type)
    new(type).build
  end

  def initialize(type)
    @pem  = Pathname.new("#{NAME}.pem")
    @pkg  = Pathname.new("pkg")
    @out  = Pathname.new("pkg/#{NAME}.#{type}")
    @src  = Pathname.new("src")
    @type = type
  end

  def build
    remove_package
    create_package
  end

  private

  def remove_package
    @out.rmtree if @out.exist?
  end

  def create_package
    @pkg.mkdir unless @pkg.exist?

    case @type.to_sym
    when :crx
      crx_make(:make)
    when :zip
      crx_make(:zip)
    when :xml
      create_xml
    end
  end

  def crx_make(method_name)
    CrxMake.send(
      method_name,
      :ignoredir         => /^\.git$/,
      :verbose           => true,
      :ex_dir            => @src,
      :pkey              => @pem,
      :"#{@type}_output" => @out
    )
  end

  def create_xml
    str = <<-"EOS"
      <?xml version="1.0" encoding="UTF-8"?>
      <gupdate xmlns="http://www.google.com/update2/response" protocol="2.0">
        <app appid="#{APP_ID}">
          <updatecheck codebase="#{CODE_BASE}" version="#{version}" />
        </app>
      </gupdate>
    EOS
    File.open(@out, "w") { |file| file << indent(str) }
  end

  def version
    pathname = @src + "manifest.json"
    JSON.parse(pathname.read)["version"]
  end

  def indent(str)
    margin = str.scan(/^ +/).map(&:size).min
    str.gsub(/^ {#{margin}}/, "")
  end
end

%w[crx zip xml].each do |name|
  desc "Create #{name}"
  task name do
    CrxPackager.build(name)
  end
end

task :default => :crx
