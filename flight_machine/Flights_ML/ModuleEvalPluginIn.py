from Module import ModuleFinal
import constants as const
import numpy as np
import pandas as pd
import sys
import random
import math
import torch

class ModuleEvalPlugIn():
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


    def format_flight_num(self, nums):
        num_arr = []
        for num in nums:
            nnum = num
            if len(num) == 1 :
                nnum = '00' + num
            if len(num) == 2 :
                nnum = '0' + num
            try:
                num_arr.append(const.FLIGHT_NUMBER_MAP[num])
            except:
                num_arr.append([random.randint(0,1) for _ in range(11)])
        return num_arr
        

    def format_company(self, companys):
        comp_arr = []
        for company in companys:
            try:
                comp_arr.append(const.COMPANY_MAP[const.AIRLINE_TO_CODE_MAP[company]])
            except:
                comp_arr.append([random.randint(0,1) for _ in range(8)])

        return comp_arr
        

    def format_dest(self, dests):
        dest_arr = []
        for dest in dests:
            try:
                dest_arr.append(const.DESTINATION_MAP[dest])
            except:
                dest_arr.append([random.randint(0,1) for _ in range(9)])

        return dest_arr

    def format_countries(self, countrys):
        country_arr = []
        for country in countrys:
            try:
                country_arr.append(const.COUNTRY_MAP[const.DEST_TO_COUNTRY_MAP[country]])
            except:
                country_arr.append([random.randint(0,1) for _ in range(8)])

        return country_arr

    def format_date_and_time(self, timestamps):
        # hour in day
        hour_in_day = [timestamp.hour * 60 + timestamp.minute for timestamp in timestamps]
        hour_in_day_norm = [ 2 * math.pi * hid / const.HOUR_IN_DAY_MAX for hid in hour_in_day]
        # day in week
        day_in_week_norm = [2 * math.pi * timestamp.day_of_week /const.DAY_IN_WEEK_MAX for timestamp in timestamps]
        # day in month
        day_in_month_norm = [2 * math.pi * timestamp.day / timestamp.days_in_month for timestamp in timestamps]
        # month
        m_norm = [2 * math.pi * timestamp.month / const.MONTH_IN_DATE_MAX for timestamp in timestamps]
        return [np.cos(hour_in_day_norm), np.sin(hour_in_day_norm), np.cos(day_in_week_norm), np.sin(day_in_week_norm), np.cos(day_in_month_norm), np.sin(day_in_month_norm), np.cos(m_norm), np.sin(m_norm)]

def main(date, time, al, fn, dst):
    me = ModuleEvalPlugIn()
    n_date = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]
    n_time = time.split(',')
    input_arr = me.format_date_and_time([pd.Timestamp(pd.to_datetime(n_date + ' ' + td, dayfirst=True)) for td in n_time])
    input_arr = np.transpose(input_arr)
    # if input_arr == 0:
    #     print(5)
    #     return

    n_al = al.split(',')
    comp = me.format_company(n_al)
    if comp == 0:
        print(5)
        return

    n_dst = dst.split(',')
    dest = me.format_dest(n_dst)
    if dest == 0:
        print(5)
        return

    #n_fn = fn.split(',')
    f_number = me.format_flight_num(fn)
    if f_number == 0:
        print(5)
        return

    country = me.format_countries(n_dst)
    if country == 0:
        print(5)
        return

    preds = []
    for inp, c, d, fn, cnt in zip(input_arr, comp, dest, f_number, country):
        input_a = np.append(inp, c)
        input_a = np.append(input_a, d)
        input_a = np.append(input_a, fn)
        input_a = np.append(input_a, cnt)
        preds.append(me.model_eval(torch.from_numpy(np.array([input_a])).float())[0][0].item())
    
    print(preds)

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
    # dt = '2022-06-03'
    # tms = ['04:45', '04:50', '04:50', '05:00', '05:05', '05:05']
    # #als = ['KL', 'LX', 'SN', 'LY', 'LO', 'TP']
    # als = ['KLM', 'EL AL', 'EL AL', 'EL AL', 'KLM', 'KLM']
    # nms = ['462', '257', '3294', '311', '152', '1604']
    # dsts = ['AMS', 'ZRH', 'BRU', 'LTN', 'WAW', 'LIS']
    # main(dt, tms, als, nms, dsts)
    l = len(sys.argv[2])
    ar = ['000' for _ in range(l)]
    main(sys.argv[1], sys.argv[2], sys.argv[3], ar, sys.argv[4])