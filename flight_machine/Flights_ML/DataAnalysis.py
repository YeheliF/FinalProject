import csv
import pandas as pd
import numpy as np
import math
import sys
import seaborn as sns
import matplotlib.pyplot as plt

class FormatUtil():
    def __init__(self):
        self.company_map = {}
        self.country_map = {}
        self.dest_map = {}
        self.f_number_map = {}


    """
     classify delay type -
     no delay < 30 min 
     minor delay < 60 min
     moderate delay < 120 min
     major delay >= 120 min
    """
    def classify_delay(self, diff):
        delay = []
        for t in diff:
            if t < 30:
                delay.append(0)
            elif t < 60:
                delay.append(1)
            elif t < 120:
                delay.append(2)
            else:
                delay.append(3)
        
        length_all = len(delay)
        print("Delay classification : ")
        print("Class 0 [{}/{}] ({}%) ".format(delay.count(0), length_all, delay.count(0) / length_all))
        print("Class 1 [{}/{}] ({}%) ".format(delay.count(1), length_all, delay.count(1) / length_all))
        print("Class 2 [{}/{}] ({}%) ".format(delay.count(2), length_all, delay.count(2) / length_all))
        print("Class 3 [{}/{}] ({}%) ".format(delay.count(3), length_all, delay.count(3) / length_all))
        return delay




def main():

    flights = pd.read_excel(sys.argv[1])
    fu = FormatUtil()
    # STO = Scheduled Time
    # ATO = Actual Time
    # format - DD-MM-YYYY hh:mm:ss
    # convert to - day in week [1,7] , day in month, month, year, hour
    flights['PTO'] = [pd.to_datetime(d, dayfirst=True) for d in flights['PTO']]
    flights['STO'] = [pd.to_datetime(d, dayfirst=True) for d in flights['STO']]

    flights['S_day_in_week'] = [pd.Timestamp(d).day_of_week for d in flights['STO']]
    flights['S_month'] = [pd.Timestamp(d).month for d in flights['STO']]
    flights['S_day_in_month'] = [pd.Timestamp(d).day for d in flights['STO']]

    diff = (flights['PTO'] - flights['STO']) / pd.Timedelta(minutes=1)

    flights['delay_time'] = diff
    flights['delay_class'] = fu.classify_delay(diff)

    # flights.drop(columns=['PTO', 'STO'], inplace=True)

    # #Create a Pandas Excel writer using XlsxWriter as the engine.
    # writer = pd.ExcelWriter('FlightData/data_analaysis.xlsx', engine='xlsxwriter')

    # # Convert the dataframe to an XlsxWriter Excel object.
    # flights.to_excel(writer)

    # # Close the Pandas Excel writer and output the Excel file.
    # writer.save()

    # df = flights.groupby('Oper', sort=True, as_index=False)['STO'].count()
    # print('GROUP-BY: Oper')
    # print(df.sort_values(by=['STO'], ascending=False))
    # print(df.nlargest(80, 'STO'))
    # print('******')

    # ax = sns.barplot(x="Oper", y='STO', data=df.nlargest(20, 'STO'))
    # plt.show()

    df = flights.groupby(['delay_class', 'Oper'], sort=True)['STO'].count()
    print('GROUP-BY: Oper')
    print(df)
    print('******')
    #print(df.sort_values(by=['STO'], ascending=False))
    print('******')
    print(df.filter(items=['0'], axis=0))
    print('******')

    # ax = sns.barplot(x="Oper", y='STO', data=df.nlargest(20, 'STO'))
    # plt.show()
    


if __name__ == "__main__":
    main()