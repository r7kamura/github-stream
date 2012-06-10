require "pathname"
require "rubygems"
require "crxmake"

module CrxPackager
  extend self

  def crx
    build
  end

  def zip
    build(:zip)
  end

  private

  def build(type = :crx)
    name = Pathname.new(".").realpath.basename
    @pem = Pathname.new("#{name}.pem")
    @pkg = Pathname.new("pkg")
    @out = Pathname.new("pkg/#{name}.#{type}")
    @src = Pathname.new("src")

    remove_package
    create_package(type)
  end

  def remove_package
    @pkg.rmtree if @pkg.exist?
  end

  def create_package(type)
    @pkg.mkdir
    CrxMake.send(
      type == :crx ? :make : :zip,
      :ignoredir        => /^\.git$/,
      :verbose          => true,
      :ex_dir           => @src,
      :pkey             => @pem,
      :"#{type}_output" => @out
    )
  end
end

%w[crx zip].each do |name|
  desc "Create #{name}"
  task name do
    CrxPackager.send(name)
  end
end

task :default => :crx
