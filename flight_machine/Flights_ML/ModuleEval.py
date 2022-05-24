from Module import ModuleFinal
import constants as const
import numpy as np
import pandas as pd
import sys
import random
import math
import torch

class ModuleEval():
    def __init__(self):
        self.model = ModuleFinal(image_size=44)
        self.model.load_state_dict(torch.load(const.SAVE_PATH))
        self.model.eval()

    """
     Delay type -
     0 : no delay < 30 min 
     1 : minor delay < 60 min
     2 : moderate delay < 120 min
     3 : major delay >= 120 min
    """
    def model_eval(self, input):
        output = self.model(input)
        return output.max(1, keepdim=True)[1]


    def format_input(self, f_num, company, dest, country):
        f_num_df = self.format_flight_num(f_num)
        company_df = self.format_company(company)
        country_df = self.format_countries(country)
        dest_df = self.format_dest(dest)


    def format_flight_num(self, num):
        nnum = num
        if len(num) == 1 :
            nnum = '00' + num
        if len(num) == 2 :
            nnum = '0' + num
        return const.FLIGHT_NUMBER_MAP[num]
        df_array = const.FLIGHT_NUMBER_MAP[num]
        column_names = ['f_number_{}'.format(i) for i in range(11)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_company(self, company):
        return const.COMPANY_MAP[company]
        df_array = const.COMPANY_MAP[company]
        column_names = ['comp_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_dest(self, dest):
        return const.DESTINATION_MAP[dest]
        df_array = const.DESTINATION_MAP[dest]
        column_names = ['dest_{}'.format(i) for i in range(9)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_countries(self, country):
        return const.COUNTRY_MAP[const.DEST_TO_COUNTRY_MAP[country]]
        df_array = const.COUNTRY_MAP[country]
        column_names = ['country_{}'.format(i) for i in range(8)]
        df = pd.DataFrame(data=np.array(df_array), columns=column_names)
        return df

    def format_date_and_time(self, timestamp):
        # hour in day
        hour_in_day = timestamp.hour * 60 + timestamp.minute 
        hour_in_day_norm = 2 * math.pi * hour_in_day / const.HOUR_IN_DAY_MAX
        # day in week
        day_in_week_norm = 2 * math.pi * timestamp.day_of_week /const.DAY_IN_WEEK_MAX
        # day in month
        day_in_month_norm = 2 * math.pi * timestamp.day / timestamp.days_in_month 
        # month
        m_norm = 2 * math.pi * timestamp.month / const.MONTH_IN_DATE_MAX
        return [np.cos(hour_in_day_norm), np.sin(hour_in_day_norm), np.cos(day_in_week_norm), np.sin(day_in_week_norm), np.cos(day_in_month_norm), np.sin(day_in_month_norm), np.cos(m_norm), np.sin(m_norm)]

def main(t_and_d, al, fn, dst):
    me = ModuleEval()

    input_arr = me.format_date_and_time(pd.Timestamp(pd.to_datetime(t_and_d, dayfirst=True)))
    if input_arr == 0:
        print(5)
        return

    comp = me.format_company(al)
    if comp == 0:
        print(5)
        return
    input_arr.extend(comp)

    dest = me.format_dest(dst)
    if dest == 0:
        print(5)
        return
    input_arr.extend(dest)

    f_number = me.format_flight_num(fn)
    if f_number == 0:
        print(5)
        return
    input_arr.extend(f_number)

    country = me.format_countries(dst)
    if country == 0:
        print(5)
        return
    input_arr.extend(country)
  
    print(me.model_eval(torch.from_numpy(np.array([input_arr])).float())[0][0].item())

def sanity_check():
    val = '1'
    while val == '1':
        comp = input("Enter company : ")
        fn = input("Enter flight num : ")
        td = input("Enter date and time : ")
        dst = input("Enter dest : ")
        pred = main(td, comp, fn, dst)
        print("Prediction: {}".format(pred))
        val = input("Continue ? ")

if __name__ == "__main__":

    # arr = ['05-06-2022 19:50', 'W6', '2812', 'VIE']
    # main('05-06-2022 21:15', 'W6', '2328', 'BUD')
    # sanity_check()
    main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])