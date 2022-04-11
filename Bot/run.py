from Utils.Scrapper import FlightScrap
import Utils.Constants as const

with FlightScrap() as bot:
    bot.land_first_page()
    bot.get_departures()
    bot.enter_airline('PEGASUS AIRLINES')
    bot.from_date('10/09/2022')
    bot.to_date('10/09/2022')
    bot.submit_data()
    print(bot.get_flights('PC 784'))



def run(f_number, date):
    airline_key = f_number[0:2]
    airline = const.AIRLINE_CODES[airline_key]['Airline Name']
    bot = FlightScrap()
    bot.land_first_page()
    bot.get_departures()
    bot.enter_airline(airline)
    bot.from_date(date)
    bot.to_date(date)
    bot.submit_data()
    print(bot.get_flights(f_number))


run('PC 784', '10/09/2022')