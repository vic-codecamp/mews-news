#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from joblib import dump, load
import os, subprocess, json

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

    dumpFileName = "classifier.joblib"
    csvFileName = "history.csv"

    documents =[]
    learn_targets = []

    clf = False


    def reload_model(self):
        print("Triggering Reload")

        if os.path.isfile(self.csvFileName):
            os.remove(self.csvFileName)

        cmd = "cp history_sample.csv "+self.csvFileName
        subprocess.call(cmd,shell=True)

        self.load_csv()
        self.train()

    # unload content from memory to relieve memory
    def unload (self):
        self.documents = []
        self.learn_targets = []

    # load the csv file into memory
    def load_csv(self):
        df = pd.read_csv(self.csvFileName)
        data = pd.DataFrame(df, columns=['title', 'action'])

        # iterate over the rows and append every row to the documents array
        for index, row in data.iterrows():
            self.documents.append(row['title'])
            self.learn_targets.append(row["action"])

    def train(self):
        text_clf = Pipeline([
            ('vect', CountVectorizer()),
            ('tfidf', TfidfTransformer()),
            ('clf', MultinomialNB()),
        ])

        # fit pipeline
        self.clf = text_clf.fit(self.documents, self.learn_targets)

        # persist trained pipeline
        # dump(clf, 'classifier.joblib')

    def classify_single(self, title):
        return self.clf.predict([title])[0]

    def classify(self, titles):
        # clf = load('classifier.joblib')

        predicted = self.clf.predict(titles)

        for doc, category in zip(docs_new, predicted):
            print('%r => %s' % (doc, self.label_cat[category]))

    def getVotes(self,data):

        r =[]
        for item in data:

            v = self.classify_single(item["title"])
            item["vote"] = int(v)
            r.append(item)

        return json.dumps(r)



    # def vote(self, username, title, vote):
    #     clf = load('classifier.joblib')
    #
    #     countVector = clf.named_steps["vect"]
    #     X_train_counts = countVector.fit_transform([title])
    #
    #     X_train_counts
    #
    #     print(X_train_counts.shape)
    #


        # X = clf.named_steps['vect'].transform([title])

        # print(X)
        # X = clf.named_steps['tfidf'].fit_transform(X)
        #
        # updated_clf = clf.named_steps['clf'].partial_fit(X, [vote])
        #
        # dump(updated_clf, 'classifier.joblib')

class SingleNewsTittleClassifier(NewsTittleClassifier,metaclass=Singleton):
    pass


if __name__ == '__main__':
    c = NewsTittleClassifier()
    c.reload_model()

    docs_new = [
        'Trump’s Defense of Major Support May Fuel Price Bounce to $8,600',
    ]
    # a.classify(docs_new)

    # a.vote("vesi", "Trump still divided over decision to release Ukraine", 2)
    # a.vote("vesi", "Live updates: Trump impeachment inquiry", 2)
    # a.vote("vesi", "Why President Trump's move from New York to Florida could", 2)

    c.classify(docs_new)



