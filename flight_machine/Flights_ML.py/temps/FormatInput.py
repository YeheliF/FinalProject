import pandas as pd
import sys
import numpy as np
import csv

class FormatInput():
    def __init__(self, co_name, cu_name, ds_name):
        self.company_file_name = co_name
        self.country_file_name = cu_name
        self.dest_file_name = ds_name

    """
     Get country maps
    """
    def format_country(self):
        self.country_map = {}
        with open(self.country_file_name, mode='r') as inp:
            reader = csv.reader(inp)
            rows_from_csv = [rows for rows in reader]
            self.country_map = {rows_from_csv[0][i]: rows_from_csv[1][i] for i in range(len(rows_from_csv[0]))}

    """
     Get dest maps
    """
    def format_dest(self):
        self.dest_map = {}
        with open(self.dest_file_name, mode='r') as inp:
            reader = csv.reader(inp)
            rows_from_csv = [rows for rows in reader]
            self.dest_map = {rows_from_csv[0][i]: rows_from_csv[1][i] for i in range(len(rows_from_csv[0]))}

    """
     Get company maps
    """
    def format_company(self):
        self.company_map = {}
        with open(self.company_file_name, mode='r') as inp:
            reader = csv.reader(inp)
            rows_from_csv = [rows for rows in reader]
            self.company_map = {rows_from_csv[0][i]: rows_from_csv[1][i] for i in range(len(rows_from_csv[0]))}

    def format_time(self):
        i = 0



flights = pd.read_excel(sys.argv[1])

input_file = csv.DictReader(open("../countryNames.csv"))
for row in input_file:
    print(np.array(row['ETHIOPIA']))
dict_from_csv = {}

# with open('Names.csv', mode='r') as inp:
#     reader = csv.reader(inp)
#     rows_from_csv = [rows for rows in reader]
#     dict_from_csv = {rows_from_csv[0][i] : rows_from_csv[1][i] for i in range(len(rows_from_csv[0]))}

print(dict_from_csv)

find_unique = True

print(['1', '2', '3'])
"""
 Find unique company, DST, country
"""
if find_unique:
    print(" --- ")
    print("company")
    print(len(flights['flight_num'].unique()))
    company = flights['flight_num'].unique()
    company_map = {}
    for i, comp in enumerate(company):
        company_map[str(comp)] = [int(j) for j in format(i, '010b')]
    # with open('cNames.csv', 'w') as csvfile:
    #     writer = csv.DictWriter(csvfile, fieldnames=company)
    #     writer.writeheader()
    #     writer.writerow(company_map)
    #     writer.close()
    print(company_map)
    print(" --- ")
    print("dest")
    print(flights['dest'].unique())
    print(" --- ")
    print("country")
    print(flights['country'].unique())
    print(" --- ")

