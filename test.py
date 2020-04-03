from selenium import webdriver

profile = webdriver.FirefoxProfile()
profile.set_preference("network.proxy.type", 1)
profile.set_preference("network.proxy.socks", "192.161.10.101")
# profile.set_preference("network.proxy.socks", "127.0.0.1")
profile.set_preference("network.proxy.socks_port", 80)
profile.update_preferences()
driver = webdriver.Firefox(profile)

# PROXY = "http://127.0.0.1:9050"
# chrome_options = webdriver.ChromeOptions()
# chrome_options.add_argument('--proxy-server=%s' % PROXY)
# driver = webdriver.Chrome(chrome_options=chrome_options)

driver.get('http://icanhazip.com/')
print(driver.page_source)
# driver.quit()
