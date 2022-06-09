import pandas as pd
from pandas import ExcelWriter
from pandas import ExcelFile
import openpyxl
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import sys
from sklearn.preprocessing import OneHotEncoder
import xlsxwriter
import math
#from FormatUtils import FormatUtil

sns.set_theme(style="whitegrid")

NUM_SECONDS_IN_A_MIN = 60

flights = pd.read_excel('allFlightData.xlsx')

find_unique = False

"""
 Find unique company, DST, country
"""
if find_unique:
    print(" --- ")
    print("company")
    print(flights['company'].unique())
    print(" --- ")
    print("dest")
    print(flights['dest'].unique())
    print(" --- ")
    print("country")
    print(flights['country'].unique())
    print(" --- ")


"""
 STO = Scheduled Time
 ATO = Actual Time 
 format - DD-MM-YYYY hh:mm:ss
 convert to - day in week [1,7] , day in month, month, year, hour
"""
# calculate difference in S-time to A-time
flights['ATO'] = [pd.to_datetime(d, dayfirst=True) for d in flights['ATO']]
flights['STO'] = [pd.to_datetime(d, dayfirst=True) for d in flights['STO']]

# flights['S_day_in_week'] =[pd.Timestamp(d).day_of_week for d in flights['STO']]
# flights['S_month'] =[pd.Timestamp(d).month for d in flights['STO']]
# flights['S_day_in_month'] =[pd.Timestamp(d).day for d in flights['STO']]

# flights['A_day_in_week'] =[pd.Timestamp(d).day_of_week for d in flights['ATO']]
# flights['A_month'] =[pd.Timestamp(d).month for d in flights['ATO']]
# flights['A_day_in_month'] = [pd.Timestamp(d).day for d in flights['ATO']]

# create a colume with timedelta as total minutes, as a float type
flights['diff'] = (flights['ATO'] - flights['STO']) / pd.Timedelta(minutes=1)

# h_in_day - hour in day
flights["h_in_d"] = [d.hour * 60 + d.minute for d in flights['STO']]
flights["h_in_d_norm"] = 2 * math.pi * flights["h_in_d"] / flights["h_in_d"].max()
flights["cos_h_in_d"] = np.cos(flights["h_in_d_norm"])
flights["sin_h_in_d"] = np.sin(flights["h_in_d_norm"])

# m - month
flights["m_norm"] = 2 * math.pi * flights['S_month'] / flights['S_month'].max()
flights["cos_m"] = np.cos(flights["m_norm"])
flights["sin_m"] = np.sin(flights["m_norm"])

# d_in_w - day in week
flights["d_in_w_norm"] = 2 * math.pi * flights["S_day_in_week"] / flights["S_day_in_week"].max()
flights["cos_d_in_w"] = np.cos(flights["d_in_w_norm"])
flights["sin_d_in_w"] = np.sin(flights["d_in_w_norm"])

# d_in_m - day in month
flights["d_in_m_norm"] = [2 * math.pi * d.day / d.days_in_month for d in flights['STO']]
flights["cos_d_in_m"] = np.cos(flights["d_in_m_norm"])
flights["sin_d_in_m"] = np.sin(flights["d_in_m_norm"])

"""
classify delay type -
 no delay < 30 min 
 minor delay < 60 min
 moderate delay < 120 min
 major delay >= 120 min
"""
d_classes = ["no delay", "minor delay", "moderate delay", "major delay"]
delay = []
for t in flights['diff'] :
    if t < 30 :
        delay.append(0)
    elif t < 60 :
        delay.append(1)
    elif t < 120 :
        delay.append(2)
    else :
        delay.append(3)

flights['delay_class'] = delay

# enc = OneHotEncoder(handle_unknown='ignore')
# enc_df = pd.DataFrame(enc.fit_transform(flights['S_day_in_week'].values.reshape(-1, 1)).toarray(), columns=['s_monday', 's_tuesday', 's_wednesday', 's_thursday', 's_friday', 's_saturday', 's_sunday'])
# # print(enc_df)
# # print(flights)
# result = pd.concat([flights, enc_df], axis=1)
# # print(result)

# fu = FormatUtil()
# fu.create_company()
# flights = pd.concat([flights, fu.create_company_df(flights['company'])], axis=1)
# fu.create_dest()
# flights = pd.concat([flights, fu.create_dest_df(flights['dest'])], axis=1)
# fu.create_countries()
# flights = pd.concat([flights, fu.create_country_df(flights['country'])], axis=1)


#flights.drop(columns=['S_day_in_week', 'S_month', 'S_day_in_month', 'ATO', 'STO', 'diff', 'h_in_d', 'h_in_d_norm', 'm_norm', 'd_in_w_norm', 'country', 'dest', 'company'], inplace=True)

ga = flights.groupby('delay_class').count()
print(ga)

print(flights)
print("number of vars :" , len(flights))

# ax = sns.countplot(x='A_day_in_week', hue='delay_class', data=flights,  palette=sns.light_palette("#2ecc71"))
# plt.show()
#
# ax = sns.countplot(x='company', hue='delay_class', data=flights,  palette=sns.husl_palette(10))
# plt.show()
# #
# # Create a Pandas Excel writer using XlsxWriter as the engine.
# writer = pd.ExcelWriter('arrival_flights.xlsx', engine='xlsxwriter')
#
# # Convert the dataframe to an XlsxWriter Excel object.
# a_flights.to_excel(writer)
#
# # Close the Pandas Excel writer and output the Excel file.
# writer.save()
#
# Create a Pandas Excel writer using XlsxWriter as the engine.
writer = pd.ExcelWriter('../files/departures_flights_for_ml.xlsx', engine='xlsxwriter')

# Convert the dataframe to an XlsxWriter Excel object.
flights.to_excel(writer)

# Close the Pandas Excel writer and output the Excel file.
writer.save()