from selenium import webdriver
import unittest


class LevelCounter(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:9000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_level_counter(self):
        driver = self.driver
        driver.get("http://localhost:9000/")
        driver.find_element_by_xpath("//div[@id='main']/section/button[2]").click()
        # Level 2, Bonus 0, Strength 2
        assert driver.find_element_by_xpath("//div[@id='main']/section/span").text == "2"
        assert driver.find_element_by_xpath("//div[@id='main']/section[3]/span").text == "2"

        driver.find_element_by_xpath("//div[@id='main']/section[2]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='main']/section[2]/button[2]").click()
        # Level 2, Bonus 2, Strength 4
        assert driver.find_element_by_xpath("//div[@id='main']/section[2]/span").text == "2"
        assert driver.find_element_by_xpath("//div[@id='main']/section[3]/span").text == "4"

        driver.find_element_by_css_selector("button").click()
        driver.find_element_by_css_selector("button").click()
        # Level 0, Bonus 2, Strength 2
        assert driver.find_element_by_xpath("//div[@id='main']/section/span").text == "0"
        assert driver.find_element_by_xpath("//div[@id='main']/section[3]/span").text == "2"

        driver.find_element_by_xpath("//div[@id='main']/section/button[2]").click()
        driver.find_element_by_xpath("//div[@id='main']/section/button[2]").click()
        # Level 2, Bonus 2, Strength 4 - no need to test
        driver.find_element_by_xpath("//div[@id='main']/section[2]/button").click()
        # Level 2, Bonus 1, Strength 3
        assert driver.find_element_by_xpath("//div[@id='main']/section[2]/span").text == "1"
        assert driver.find_element_by_xpath("//div[@id='main']/section[3]/span").text == "3"

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
