var selenium = require('selenium-webdriver'),
    should = require('should'),
    chromedriver = require('chromedriver'),
    By = require('selenium-webdriver').By,
    driver,
    userInfo = { 
      email: 'test' + Math.round(Math.random()*10) + 1 + '@test.com',
      password: '123456'
    },
    address = '1234 New Street, Northridge, CA 91304',
    testCompany = {
      name: "FooBar Inc.",
      position: "CFO",
      applied: '12/12/2016',
      interviewDate: '12/25/2016',
      contactName: 'Foo Johnson',
      phone: '7263712261',
      email: 'foo@bar.com',
      linkedIn: 'FooBar',
      notes: 'notesssss',
      address: '1234 google st, northridge, ca 90505'
    },
    path = require('path'),
    realPath = path.dirname(path.dirname(path.dirname(__dirname))),
    coverLetterPath = path.resolve(realPath, 'test/fixtures/coverLetter.pdf'),
    resumePath = path.resolve(realPath, 'test/fixtures/resume.pdf');

before(function(done) {
  driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build();

  driver.get('http://localhost:1337').then(done);
});

after(function(done) {
  driver.quit().then(done);
});

describe('Logging in:', function() {
  beforeEach(function() {
    driver.get ('http://localhost:1337');
  });

  it('should be able to signup', function(done) {
    driver.findElement(By.linkText('Sign up now!')).click();
    driver.findElement(By.name('email')).sendKeys(userInfo.email);
    driver.findElement(By.name('password')).sendKeys(userInfo.password);
    driver.findElement(By.className('btn-default')).click();
    driver.getCurrentUrl().then(function(value) {
      (value).should.equal('http://localhost:1337/dashboard');
      done();
    });
  });

  it('should be able to logout', function(done) {
    driver.findElement(By.css('a[href="/logout"]')).sendKeys(selenium.Key.ENTER);
    driver.getCurrentUrl().then(function(value) {
      (value).should.equal('http://localhost:1337/login');
      done();
    });
  });

  it('should be able to login', function(done) {
    driver.findElement(By.name('email')).sendKeys(userInfo.email);
    driver.findElement(By.name('password')).sendKeys(userInfo.password);
    driver.findElement(By.className('btn-default')).click();
    driver.getCurrentUrl().then(function(value) {
     (value).should.equal('http://localhost:1337/dashboard');
     done();
    });
  });
});

describe('dashboard', function() {
  beforeEach(function() {
    driver.get('http://localhost:1337/dashboard');
  });

  it('should be able to update address', function(done) {
    driver.findElement(By.name('address')).sendKeys(address);
    driver.findElement(By.id('updateAddress')).click();
    driver.findElement(By.id('userAddress')).getText().then(function(text) {
      (text).should.equal(address);
      done();
    })
  });

  it('should be able to upload a resume and set it as default', function(done) {
    driver.findElement(By.name('resume')).sendKeys(resumePath);
    driver.findElement(By.id('resumeUploadButton')).click();
    driver.findElement(By.id('defaultResume')).getText().then(function(text) {
      (text).should.equal('resume.pdf');
      done();
    });
  });

  it('should be able to upload a cover letter and set it as default', function(done) {
    driver.findElement(By.name('coverLetter')).sendKeys(coverLetterPath);
    driver.findElement(By.id('coverLetterUploadButton')).click();
    driver.findElement(By.id('defaultCoverLetter')).getText().then(function(text) {
      (text).should.equal('coverLetter.pdf');
      done();
    });
  });
});