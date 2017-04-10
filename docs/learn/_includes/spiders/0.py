$ scrapy shell http://quotes.toscrape.com/random
>>> response.css('small.author::text').extract_first()
>>> response.css('span.text::text').extract_first()
>>> response.css('a.tag::text').extract()
