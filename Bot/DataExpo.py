import pandas as pd

airline_codes = pd.read_excel('airline-codes.xlsx')
print(airline_codes)

trans_df = airline_codes.set_index("IATA Designator").T


a_dictionary = trans_df.to_dict()
print(a_dictionary)
print(a_dictionary['A3']['Airline Name'])