# Note: Github doesn't allow plugins to execute (safemode). These filters won't work on github pages.
module Jekyll
  module CacheBustFilters
    # A simple class to handle md5 hexdigesting
    # Initializing params:
    # * file_name - String - required - this is both filename to which the md5
    #   hash will be appended to, and will be read for hexdigest in the absence
    #   of a passed in directory.
    # * directory - String - optional - path of directory files that will be
    #   recursively read and passed into hexdigest
    class CacheDigester
      require 'digest/md5'

      attr_accessor :file_name

      def initialize(file_name:)
        self.file_name = file_name
      end

      def digest!
        @var = directory_files_content
        [file_name, '?v=', Digest::MD5.hexdigest(directory_files_content)].join
      end

      private

      def directory_files_content
        @assets = Jekyll.configuration({})['assets']['sources'][0]
        @filetype = file_name.gsub(/.*?\.([a-z]+)/, '\1')
        target_path = File.join(@assets, @filetype, '**', '*')
        Dir[target_path].map{|f| File.read(f) unless File.directory?(f) }.join
      end
    end

    # Gets Md5 contents of target file (assumed to be using the full path)
    # and appends a hash end of to asset file reference. Ensures deployed
    # asset files are "cachebust-ed" every time the file changes
    def md5_cache_bust(file_name)
      CacheDigester.new(file_name: file_name).digest!
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBustFilters)
