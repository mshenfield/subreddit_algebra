from locust import HttpLocust, TaskSet

def completion(l):
    l.client.get('/api/completions/shitty_')

def index(l):
    l.client.get('/')

def algebra(l):
    l.client.get('/api/algebra/the_donald/-/politics')

class UserBehavior(TaskSet):
    tasks = {index: 1, completion: 50, algebra: 15}

class SubredditAlgebraUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 25
    max_wait = 100
