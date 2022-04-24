# Load selenium components
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import *
import time

# Establish chrome driver and go to report site URL
url = "https://www.flightview.com/flighttracker/"
driver = webdriver.Safari()
driver.get(url)
try:
    driver.delete_all_cookies()
except:
    print("no cookies ")

driver.implicitly_wait(1)
airline_name = "PC Pegasus Airlines"
flightnumber_name = "784"
flightdate_name = 'Tue, Oct 11, 2022'
enter = driver.find_element(By.CSS_SELECTOR, 'input.trackflightbtn')
print("sss")
airline = driver.find_element(By.ID, 'namal')
airline2 = driver.find_element(By.ID, 'codal')
flightnum = driver.find_element(By.ID, 'flightnumber-fill')
flightdate = driver.find_element(By.ID, 'start-date-single-real')
driver.execute_script("arguments[0].setAttribute('value', '20221011')", flightdate)
driver.execute_script("arguments[0].setAttribute('value', 'PC')", airline2)
#flightdate.send_keys(flightdate_name)
flightnum.send_keys(flightnumber_name)
airline.send_keys(airline_name)
#airline.send_keys(Keys.ENTER)

try :
    print("submit")
    enter.submit()

except Exception as e:
    print("submit exception : ")
    print(e)
    pass

#prints parent window title
print("Parent window title: " + driver.title)
#get current window handle
p = driver.current_window_handle
#get first child window
chwnd = driver.window_handles
for w in chwnd:
    print(w)
    #switch focus to child window
    if w != p :
        print("diff")
        driver.switch_to.window(w)

print("Child window title: " + driver.title)

# element = WebDriverWait(driver, timeout=5).until(lambda d: driver.find_elements(By.ID, 'dismiss-button'))
# element.click()
#
# try:
#     element = WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located(By.ID, 'dismiss-button')
#     )
#     element.click()
# except :
#     print("no add")
#     pass
#
# try :
#     alert = driver.switch_to.alert
#     alert.dismiss()
#     close_element = driver.find_elements(By.ID, 'dismiss-button')
#     close_element.click()
# except :
#     print("no addd")
#
driver.implicitly_wait(10)
# driver.back()
data = driver.find_elements(By.CLASS_NAME, 'search-results')
for d in data:
    print(d.text)
# terminal = driver.find_element(By.CLASS_NAME, 'search-results-table-data FlightTrackerData')
# print(terminal.text)
# dest = driver.find_element(By.ID, 'txt_arraptlnk')
# print(dest.text)
# ariv_time = driver.find_element(By.CLASS_NAME, 'search-results-table-data FlightTrackerData')
# print(ariv_time.text[0])
# aircraft = driver.find_element(By.XPATH,'//*[@id="search-results-body-nobg"]/div[6]/table/tbody/tr[1]/td[5]/text()')
# print(aircraft.text)

driver.find_element(By.XPATH, '//*[@id="search-results-body-nobg"]').click()


#enter.click()