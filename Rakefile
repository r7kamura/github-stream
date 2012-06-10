require "pathname"
require "rubygems"
require "crxmake"

class CrxPackager
  def self.build(type)
    new(type).build
  end

  def initialize(type)
    name  = Pathname.new(".").realpath.basename
    @pem  = Pathname.new("#{name}.pem")
    @pkg  = Pathname.new("pkg")
    @out  = Pathname.new("pkg/#{name}.#{type}")
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
    CrxMake.send(
      @type.to_sym == :crx ? :make : :zip,
      :ignoredir         => /^\.git$/,
      :verbose           => true,
      :ex_dir            => @src,
      :pkey              => @pem,
      :"#{@type}_output" => @out
    )
  end
end

%w[crx zip].each do |name|
  desc "Create #{name}"
  task name do
    CrxPackager.build(name)
  end
end

task :default => :crx
