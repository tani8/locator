class LocatorController < ApplicationController
  def index

    # address comes from user input form
    if(params[:address])
      # substituting spaces and commas in user input to generate address string to pass to google maps api
      @address = params[:address].gsub(" ", "+").gsub(",", "")

      #using HTTParty to ping google maps API
      geocodeLatLng = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{@address}&key=AIzaSyCfYs8m-XUsyrvdZUDUDc2_C3obAbTAfXI")

      # parsing data to retrieve long and lat of users input address
      @lat = JSON.parse(geocodeLatLng.body)["results"][0]["geometry"]["location"]["lat"]
      @lon = JSON.parse(geocodeLatLng.body)["results"][0]["geometry"]["location"]["lng"]

      # resets address in params hash and instance var to nil
      params[:address] = nil;
      @address = nil;

      # sends lon and lat as json to use in chase API
      render json: {lati: @lat, lngi: @lon}
    end
  end

  def chaseparty
    # use=ing httparty to get response from Chase API
    @response = HTTParty.get("https://m.chase.com/PSRWeb/location/list.action?lat=#{params[:lati]}&lng=#{params[:longi]}")
    # sends response back as json
    render json: @response

  end

  # would have been used if navigating to distinct pages per location for details page
  def show
    # return render :show, layout: false
  end

end
