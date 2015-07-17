class LocatorController < ApplicationController
  def index

    if(params[:address])
      @address = params[:address].gsub(" ", "+").gsub(",", "")
      p "ADDRESS: #{@address}"

      geocodeLatLng = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{@address}&key=AIzaSyCfYs8m-XUsyrvdZUDUDc2_C3obAbTAfXI")
      @lat = JSON.parse(geocodeLatLng.body)["results"][0]["geometry"]["location"]["lat"]
      @lon = JSON.parse(geocodeLatLng.body)["results"][0]["geometry"]["location"]["lng"]


      params[:address] = nil;
      render json: {lati: @lat, lngi: @lon}
    end
  end

  def chaseparty
    # headers = { "User-Agent" => "StacksOnStacks",
                # "Authorization" => ENV['GITHUB_KEY']}

    @response = HTTParty.get("https://m.chase.com/PSRWeb/location/list.action?lat=#{params[:lati]}&lng=#{params[:longi]}")
    # p @response
    render json: @response
      # , headers: headers)

  end

  def show

  end

end
