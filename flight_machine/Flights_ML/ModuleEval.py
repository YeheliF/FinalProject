from Module import ModuleFinal
import constants as const
import numpy as np
import pandas as pd
import sys
import random

class ModuleEval():
    def __init__(self, save_path):
        self.model = ModuleFinal(image_size=31)
        self.model.load_state_dict(save_path)
        self.model.eval()

    """
     Delay type -
     0 : no delay < 30 min 
     1 : minor delay < 60 min
     2 : moderate delay < 120 min
     3 : major delay >= 120 min
    """
    def model_eval(self, input):
        output =self.model(input)
        return output


    def format_input(self, f_num, company, dest, country):
        f_num_df = self.format_flight_num(f_num)
        company_df = self.format_company(company)
        country_df = self.format_countries(country)
        dest_df = self.format_dest(dest)


    def format_flight_num(self, num):
        df_array = const.FLIGHT_NUMBER_MAP[num]
        column_names = ['f_number_{}'.format(i) for i in range(10)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_company(self, company):
        df_array = const.COMPANY_MAP[company]
        column_names = ['comp_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_dest(self, dest):
        df_array = const.DESTINATION_MAP[dest]
        column_names = ['dest_{}'.format(i) for i in range(9)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_countries(self, country):
        df_array = const.COUNTRY_MAP[country]
        column_names = ['country_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df


def main(flight_data):
    print(str(random.randint(0, 3)))

if __name__ == "__main__":
    main(sys.argv[1])