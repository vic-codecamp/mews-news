#!/usr/bin/python3

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from joblib import dump, load
import os
import subprocess

class NewsTittles:

    labels = [0, 1, 2]
    label_cat = ["down", "netruaal", "up"]

    dumpFileName = "classifier.joblib"
    csvFileName = "history.csv"

    documents =[]
    learn_targets = []

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
        clf = text_clf.fit(self.documents, self.learn_targets)

        # persist trained pipeline
        dump(clf, 'classifier.joblib')

    def classify(self, titles):
        clf = load('classifier.joblib')

        predicted = clf.predict(titles)

        for doc, category in zip(docs_new, predicted):
            print('%r => %s' % (doc, self.label_cat[category]))

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


a = NewsTittles()
a.reload_model()

docs_new = [
    'Trump’s Defense of Major Support May Fuel Price Bounce to $8,600',
]
# a.classify(docs_new)

# a.vote("vesi", "Trump still divided over decision to release Ukraine", 2)
# a.vote("vesi", "Live updates: Trump impeachment inquiry", 2)
# a.vote("vesi", "Why President Trump's move from New York to Florida could", 2)

a.classify(docs_new)

# a.print()


