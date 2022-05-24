import csv
import pandas as pd
import numpy as np
import math
import sys

class FormatUtil():
    def __init__(self):
        self.company_map = {}
        self.country_map = {}
        self.dest_map = {}
        self.f_number_map = {}

    """
     Create mapping between flight number to binary encoding and save it to file. 
    """
    def create_flight_number(self, f_number):
        # create mapping
        for i, fn in enumerate(f_number):
            self.f_number_map[fn] = [int(j) for j in format(i, '011b')]
        # print
        # print(self.f_number_map)
        # save mapping
        with open('data_files/FlightNumbers.csv', 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=f_number)
            writer.writeheader()
            writer.writerow(self.f_number_map)

    """
     Create DataFrame for given input of flight numbers for the machine through the mapping created.
     Returns DataFrame with 10 columns.
    """
    def create_flight_number_df(self, numbers):
        # map
        df_array = []
        for n in numbers:
            df_array.append(self.f_number_map[n])
        #print(df_array)
        # create column names
        column_names = ['f_number_{}'.format(i) for i in range(11)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        # print
        # print(df)
        # return
        return df


    """
     Create mapping between company to binary encoding and save it to file. 
    """
    def create_company(self, company):
        # create mapping
        for i, comp in enumerate(company):
            self.company_map[comp] = [int(j) for j in format(i, '08b')]
        # print
        print(self.company_map)
        # save mapping
        with open('data_files/CompanyNames.csv', 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=company)
            writer.writeheader()
            writer.writerow(self.company_map)

    """
     Create DataFrame for given input of companies for the machine through the mapping created.
     Returns DataFrame with 8 columns.
    """
    def create_company_df(self, names):
        # map
        df_array = []
        for n in names:
            df_array.append(self.company_map[n])
        # create column names
        column_names = ['comp_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        # print
        # print(df)
        # return
        return df

    """
     Create mapping between destination to binary encoding and save it to file. 
    """
    def create_dest(self, dest):
        # create mapping
        for i, d in enumerate(dest):
            self.dest_map[d] = [int(j) for j in format(i, '09b')]
        # print
        print(self.dest_map)
        # save mapping
        with open('data_files/destinationNames.csv', 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=dest)
            writer.writeheader()
            writer.writerow(self.dest_map)

    """
     Create DataFrame for given input of destinations for the machine through the mapping created.
     Returns DataFrame with 9 columns.
    """
    def create_dest_df(self, names):
        # map
        df_array = []
        for n in names:
            df_array.append(self.dest_map[n])
        # create column names
        column_names = ['dest_{}'.format(i) for i in range(9)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        # print
        # print(df)
        # return
        return df

    """
     Create mapping between countries to binary encoding and save it to file. 
    """
    def create_countries(self, countr):
        # format country names
        country = [c.replace('\n', ' ') for c in countr]
        country = np.unique(country)
        # create mapping
        for i, count in enumerate(country):
            self.country_map[count] = [int(j) for j in format(i, '08b')]
        # reformat
        #self.country_map['UNITED ARAB\nEMIRATES'] = self.country_map['UNITED ARAB EMIRATES']
        # print
        # print(self.country_map)
        # save mapping
        with open('countryNames.csv', 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=countr)
            writer.writeheader()
            writer.writerow(self.country_map)

    """
     Create DataFrame for given input of countries for the machine through the mapping created.
     Returns DataFrame with 8 columns.
    """
    def create_country_df(self, names):
        # map
        df_array = []
        for n in names:
            df_array.append(self.country_map[n])
        # create column names
        column_names = ['country_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        # print
        # print(df)
        # return
        return df

    """
     Create normalized data for hour in day
    """
    def create_hour_in_day(self, date):
        hour_in_day = np.array([d.hour * 60 + d.minute for d in date])
        self.hour_in_day_max = max(hour_in_day)
        print('self.hour_in_day_max')
        print(self.hour_in_day_max)
        hour_in_day_norm = 2 * math.pi * hour_in_day / self.hour_in_day_max

        return (np.cos(hour_in_day_norm), np.sin(hour_in_day_norm))

    """
     Create normalized data for month in date
    """
    def create_month_in_date(self, date):
        self.month_in_date_max = max(date)
        print('self.month_in_date_max')
        print(self.month_in_date_max)
        m_norm = 2 * math.pi * np.array(date) / self.month_in_date_max
        return (np.cos(m_norm), np.sin(m_norm))

    """
     Create normalized data for day in week
    """
    def create_day_in_week(self, day):
        self.day_in_week_max = max(day)
        print('self.day_in_week_max')
        print(self.day_in_week_max)
        day_in_week_norm = 2 * math.pi * np.array(day) / self.day_in_week_max
        return (np.cos(day_in_week_norm), np.sin(day_in_week_norm))

    """
     Create normalized data for day in month
    """
    def create_day_in_month(self, day):
        self.day_in_month_max =[]
        day_in_month_norm = [2 * math.pi * d.day / d.days_in_month for d in day]
        return (np.cos(day_in_month_norm), np.sin(day_in_month_norm))

    """
     Save normalized data for machine
    """
    def save_date_data(self):

        a_file = open("data_files/DateNormData.txt", "w")

        np.savetxt(a_file, self.hour_in_day_max)
        np.savetxt(a_file, self.day_in_week_max)
        np.savetxt(a_file, self.day_in_month_max)
        np.savetxt(a_file, self.month_in_date_max)

        a_file.close()

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

    S_day_in_week = [pd.Timestamp(d).day_of_week for d in flights['STO']]
    S_month = [pd.Timestamp(d).month for d in flights['STO']]
    S_day_in_month = [pd.Timestamp(d).day for d in flights['STO']]

    diff = (flights['PTO'] - flights['STO']) / pd.Timedelta(minutes=1)

    h_in_d = fu.create_hour_in_day(flights['STO'])
    flights["cos_h_in_d"] = h_in_d[0]
    flights["sin_h_in_d"] = h_in_d[1]

    d_in_w = fu.create_day_in_week(S_day_in_week)
    flights["cos_d_in_w"] = d_in_w[0]
    flights["sin_d_in_w"] = d_in_w[1]

    d_in_m = fu.create_day_in_month(flights['STO'])
    flights["cos_d_in_m"] = d_in_m[0]
    flights["sin_d_in_m"] = d_in_m[1]

    m_in_d = fu.create_month_in_date(S_month)
    flights["cos_m"] = m_in_d[0]
    flights["sin_m"] = m_in_d[1]

    fu.create_company(flights['Oper'].unique())
    flights = pd.concat([flights, fu.create_company_df(flights['Oper'])], axis=1)
    fu.create_dest(flights['Locn1'].unique())
    flights = pd.concat([flights, fu.create_dest_df(flights['Locn1'])], axis=1)
    fu.create_flight_number(flights['Flt No'].unique())
    flights = pd.concat([flights, fu.create_flight_number_df(flights['Flt No'])], axis=1)
    fu.create_countries(flights['Country'].unique())
    flights = pd.concat([flights, fu.create_country_df(flights['Country'])], axis=1)

    flights['delay_time'] = diff
    flights['delay_class'] = fu.classify_delay(diff)

    # flights.drop(columns=['PTO', 'STO'], inplace=True)

    # #Create a Pandas Excel writer using XlsxWriter as the engine.
    # writer = pd.ExcelWriter('FlightData/departures_flights_formatted.xlsx', engine='xlsxwriter')

    # # Convert the dataframe to an XlsxWriter Excel object.
    # flights.to_excel(writer)

    # # Close the Pandas Excel writer and output the Excel file.
    # writer.save()


if __name__ == "__main__":
    main()