# -*- coding: utf-8 -*-
import scrapy


class QuotesLoginSpider(scrapy.Spider):
    name = 'quotes-login'
    login_url = 'http://quotes.toscrape.com/login'
    start_urls = [login_url]

    def parse(self, response):
        # extract the csrf token value
        token = response.css('input[name="csrf_token"]::attr(value)').extract_first()
        # create a python dictionary with the form values
        data = {
            'csrf_token': token,
            'username': 'abc',
            'password': 'abc',
        }
        # submit a POST request to it
        yield scrapy.FormRequest(url=self.login_url, formdata=data, callback=self.parse_quotes)

    def parse_quotes(self, response):
        """Parse the main page after the spider is logged in"""
        for q in response.css('div.quote'):
            yield {
                'author_name': q.css('small.author::text').extract_first(),
                'author_url': q.css(
                    'small.author ~ a[href*="goodreads.com"]::attr(href)'
                ).extract_first()
            }
