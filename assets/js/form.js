$( document ).ready(function() {

    $.get("https://freegeoip.net/json/", function(x) {
        $('#country').val(x["country_name"]);
        $('#city').val(x["city"]);
    });

    $("form.schedule-form").validate({
      rules: {
        first_name: "required",
        last_name: "required",
        email: "required",
        company: "required",
        timezone: "required",
        number_of_seats: "required",
        python_expertise: "required",
        scrapy_expertise: "required",
        webscraping_expertise: "required",
        htmlcss_expertise: "required",
      }
    });

});
