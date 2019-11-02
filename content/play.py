#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from joblib import dump, load
import os, subprocess, json


class NewsTittleClassifier:

    # __metaclass__ = Singleton

    labels = [0, 1, 2]
    label_cat = ["down", "neutral", "up"]

    dumpFileName = "classifier.joblib"
    csvFileName = "history.csv"

    documents =[]
    learn_targets = []

    clf = False
    count_vect = False
    tfidf_transformer = False

    # load the csv file into memory
    def load_csv(self):
        df = pd.read_csv(self.csvFileName)
        data = pd.DataFrame(df, columns=['title', 'action'])

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            self.documents.append(row['title'])
            self.learn_targets.append(row["action"])

    def train(self):

        self.count_vect = CountVectorizer()
        X_train_counts = self.count_vect.fit_transform(self.documents)

        self.tfidf_transformer = TfidfTransformer()
        X_train_tfidf = self.tfidf_transformer.fit_transform(X_train_counts)

        self.clf = MultinomialNB()
        self.clf.fit(X_train_tfidf, self.learn_targets)

    def vote(self,s,v):
        X_train_counts = self.count_vect.transform([s])
        X_train_tfidf = self.tfidf_transformer.transform(X_train_counts)
        self.clf.partial_fit(X_train_tfidf,[v])

        return True

    def classify_single(self, title):
        a = self.classify([title])
        return a[0]

    def classify (self,items):
        X_new_counts = self.count_vect.transform(items)
        X_new_tfidf = self.tfidf_transformer.transform(X_new_counts)

        predicted = self.clf.predict(X_new_tfidf)

        return predicted

if __name__ == '__main__':

    a = NewsTittleClassifier()
    a.load_csv()
    a.train()

    t = "BITCOIN EXPLOSIVE MOVE SOON!?! FLASH CRASH & BitMEX Email LEAK! Bullish News!!"
    r = a.classify_single(t)
    print("Val: "+str(r)+" => "+t)

    t = "Trump’s Defense of Major Support May Fuel Price Bounce to $8,600"
    r = a.classify_single(t)
    print("Val: "+str(r)+" => "+t)

    a.vote("Trump still divided over decision to release Ukraine", 2)
    a.vote("Live updates: Trump impeachment inquiry", 2)
    a.vote("Why President Trump's move from New York to Florida could", 2)

    r = a.classify_single(t)
    print("Val: "+str(r)+" => "+t)