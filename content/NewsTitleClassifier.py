#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from joblib import dump, load
import os, subprocess, json
import pickle


class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class NewsTittleClassifier:

    # __metaclass__ = Singleton

    labels = [0, 1, 2]
    label_cat = ["down", "neutral", "up"]

    dumpFileName = "mew_news"
    csvFileName = "history.csv"

    documents =[]
    learn_targets = []

    clf = False
    count_vect = False
    tfidf_transformer = False

    def __init__(self):
        print("Init")

        self.count_vect = CountVectorizer()
        self.tfidf_transformer = TfidfTransformer()
        self.clf = MultinomialNB()

    #loaad the model dump file if is present, if not create a new one based on csv
    def load(self):
        if not os.path.isfile(self.dumpFileName+"_clf.obj"):
            print("loading csv file")
            self.__load_csv()
            self.__train()
            self.__unload()
        else:
            print("loading dump file")
            self.__load_model()

    # def reload_model(self):
    #     print("Triggering Reload")
    #
    #     if os.path.isfile(self.csvFileName):
    #         os.remove(self.csvFileName)
    #
    #     cmd = "cp history_sample.csv "+self.csvFileName
    #     subprocess.call(cmd, shell=True)
    #
    #     self.load_csv()
    #     self.train()

    # unload content from memory to relieve memory
    def __unload (self):
        self.documents = []
        self.learn_targets = []

    # load the csv file into memory
    def __load_csv(self):
        df = pd.read_csv(self.csvFileName)
        data = pd.DataFrame(df, columns=['title', 'action'])

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            self.documents.append(row['title'])
            self.learn_targets.append(row["action"])

    # Train a new classifier, normally when loading a csv file
    def __train(self):
        train_count = self.count_vect.fit_transform(self.documents)
        trained_tfdf = self.tfidf_transformer.fit_transform(train_count)
        self.clf.fit(trained_tfdf, self.learn_targets)
        self.__dump_model()

    def __dump_model(self):
        pickle.dump( self.clf, open( self.dumpFileName+"_clf.obj", "wb"))
        pickle.dump( self.count_vect, open( self.dumpFileName+"_cv.obj", "wb"))
        pickle.dump( self.tfidf_transformer, open( self.dumpFileName+"_tfidf.obj", "wb"))


    def __load_model(self):
        self.clf = pickle.load( open( self.dumpFileName+"_clf.obj", "rb"))
        self.count_vect = pickle.load( open( self.dumpFileName+"_cv.obj", "rb"))
        self.tfidf_transformer = pickle.load( open( self.dumpFileName+"_tfidf.obj", "rb"))

    # return the classification value of a single title
    def classify_single(self, title):
        a = self.classify([title])
        return a[0]

    def classify (self,items):
        X_new_counts = self.count_vect.transform(items)
        X_new_tfidf = self.tfidf_transformer.transform(X_new_counts)
        predicted = self.clf.predict(X_new_tfidf)

        return predicted


    # get a array of items and return the same with classification added
    # every item needs to have a k:v title
    def getVotes(self,data):
        r =[]
        for item in data:
            v = self.classify_single(item["title"])
            item["vote"] = int(v)
            r.append(item)

        return json.dumps(r)

    def vote(self, username, title, vote):
        X_train_counts = self.count_vect.transform([title])
        X_train_tfidf = self.tfidf_transformer.transform(X_train_counts)

        self.clf.partial_fit(X_train_tfidf,[vote])
        self.__dump_model()
        return True



class SingleNewsTittleClassifier(NewsTittleClassifier,metaclass=Singleton):
    pass


if __name__ == '__main__':
    c = SingleNewsTittleClassifier()
    c.load()

    t = "BITCOIN EXPLOSIVE MOVE SOON!?! FLASH CRASH & BitMEX Email LEAK! Bullish News!!"
    r = c.classify_single(t)
    print("Val: "+str(r)+" => "+t)

    t = "Trump’s Defense of Major Support May Fuel Price Bounce to $8,600"

    r = c.classify_single(t)
    print("Val: "+str(r)+" => "+t)

    c.vote("ignore", "Trump still divided over decision to release Ukraine", 2)
    c.vote("ignore", "Live updates: Trump impeachment inquiry", 2)
    c.vote("ignore", "Why President Trump's move from New York to Florida could", 2)

    r = c.classify_single(t)
    print("Val: "+str(r)+" => "+t)






