from flask import Flask, render_template, request, jsonify
import spacy
import json

app = Flask(__name__)

nlp = spacy.load("en_core_web_sm")

# Load keywords and responses from the JSON file

with open('demo.json', 'r') as f:
    json_data = json.load(f)

@app.route('/')
def index():
    return render_template('base.html')


@app.route('/process_input', methods=['POST'])
def process_input():
    user_input = request.form['user_input']
    matched_responses = get_matched_responses(user_input.lower())
    return jsonify({'responses': matched_responses})


# Filter the input for matching keywords and accordingly process the output
def get_matched_responses(user_input):

    matched_responses = []

    keywords = ['evaluate', 'claim', 'insurance', 'policy', 'risk']
    user_input_doc = nlp(user_input)
    user_keywords = sorted([token.lemma_ for token in user_input_doc if token.lemma_ in keywords])
    search_key = ' '.join(user_keywords)
    
    if search_key in json_data:
        matched_responses = json_data[search_key]

    #matched_responses = json_data.get(search_key)

    return matched_responses


if __name__ == '__main__':
    app.run(debug=True)