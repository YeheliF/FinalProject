import pandas as pd
import sys
from pandas import ExcelWriter
from pandas import ExcelFile

def sep_flights(file_name, dep_flights_name, arrival_flights_name):
    # load file
    all_flights = pd.read_excel(file_name)

    # rename columns
    all_flights = all_flights.rename(columns={"A_D" : 'AorD'})
    # remove rows and column of cancelled / delayed flights
    # all_flights = all_flights.drop(all_flights[(all_flights.CorD == 'C') | (all_flights.CorD == 'D')].index)
    # all_flights = all_flights.drop(['CorD'], axis=1)
    # remove flights with no actual dep time
    all_flights = all_flights.drop(all_flights[(~all_flights.ATO.notnull())].index)

    # create arrival flights
    a_flights = all_flights.drop(all_flights[(all_flights.AorD == 'D')].index)
    a_flights = a_flights.drop(['AorD'], axis=1)
    # create departure flights
    d_flights = all_flights.drop(all_flights[(all_flights.AorD == 'A')].index)
    d_flights = d_flights.drop(['AorD'], axis=1)

    # Create a Pandas Excel writer using XlsxWriter as the engine.
    writer = pd.ExcelWriter(arrival_flights_name, engine='xlsxwriter')

    # Convert the dataframe to an XlsxWriter Excel object.
    a_flights.to_excel(writer)

    # Close the Pandas Excel writer and output the Excel file.
    writer.save()

    # Create a Pandas Excel writer using XlsxWriter as the engine.
    writer = pd.ExcelWriter(dep_flights_name, engine='xlsxwriter')

    # Convert the dataframe to an XlsxWriter Excel object.
    d_flights.to_excel(writer)

    # Close the Pandas Excel writer and output the Excel file.
    writer.save()