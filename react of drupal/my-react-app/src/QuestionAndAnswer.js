import React, { useEffect, useState } from 'react';
import './QuestionAndAnswer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function QaA() {
    const [response, setResponse] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [topics, setTopics] = useState([]);
    const [currentTopic, setCurrentTopic] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://my-site.ddev.site/question_and_answer1_json', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const sortedData = sortDataByOrder(data);
                setResponse(sortedData);
                getTopics(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const removeHtmlTags = (text) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const sortDataByOrder = (data) => {
        return data.sort((a, b) => a.field_order_value - b.field_order_value);
    };

    const getTopics = (data) => {
        let topicNow = [...new Set(data.map(item => removeHtmlTags(item.field_topic)))];
        setTopics(topicNow);
        setCurrentTopic(topicNow[0]);
    };

    const handleQuestionClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const renderTopics = () => (
        <div className="nav nav-tabs">
            {topics.map((topic, index) => (
                <a key={index} className={`nav-item nav-link ${topic === currentTopic ? 'active' : ''}`} onClick={() => setCurrentTopic(topic)} href="#">
                    {topic}
                </a>
            ))}
        </div>
    );

    const renderTableRows = () => (
        response.map((item, index) => {
            if (removeHtmlTags(item.field_topic) === currentTopic) {
                return (
                    <React.Fragment key={index}>
                        <div className="question-row mb-3" onClick={() => handleQuestionClick(index)}>

                            <span className={`arrow ${openIndex === index ? 'open' : ''}`}>▼</span>
                            {item.field_questions}
                        </div>
                        <div className={`answer-row ${openIndex === index ? 'show' : ''}`}>
                            <div className="answer p-3">
                                <div className="answer-box">
                                    {removeHtmlTags(item.field_answer)}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }
            return null;
        })
    );

    return (
        <div className="container">
            <h1 className="page-title">Questions and Answers</h1>
            {renderTopics()}
            <div className="table-container">
                {renderTableRows()}
            </div>
        </div>
    );
}

export default QaA;
