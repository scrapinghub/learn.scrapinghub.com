import scrapy
from scrapy_splash import SplashRequest

class QuotesJSSpider(scrapy.spider):
    name = 'splashscrape'
    
    def start_requests(self):
        yield SplashRequest(
            url='http://quotes.toscrape.com/js',
            callback=self.parse,
        )
        
    def parse(self,response):
        for quote in response.css("div.quote"):
            yield {
                'text': quote.css("span.text::text").extract_first(),
                'author': quote.css("small.author::text").extract_first(),
                'tags': quote.css("div.tags > a.tag::text").extract(),
            }
            
            
