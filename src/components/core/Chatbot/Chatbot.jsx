import axios from "axios";
import React, { useState } from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import { CgSearchLoading } from "react-icons/cg";
import Spinner from "../../../assets/Images/spinner.gif";

const Chatbot = () => {
  const [question, setQuestion] = useState(""); 
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to format the response text
  const formatResponse = (text) => {
    if (!text) return "";
    
    // Split text into paragraphs and filter out empty lines
    const paragraphs = text.split('\n').filter(para => para.trim());
    
    return paragraphs.map((para, index) => (
      <p key={index} style={{ marginBottom: '1rem' }}>
        {para}
      </p>
    ));
  };

  async function generateResponse() {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBaGBm-KHyf6jsvXOeoB4YgjYePp6jCLrw",
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      setResponse(res.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setResponse("Failed to get a response. Please try again.");
      console.error("Error fetching response:", error);
    }

    setLoading(false);
  }

  return (
    <div className="text-white">
      <div className="text-center text-4xl font-semibold mt-7">
        Ask Your Doubts to Our <HighlightText text={"Intelligent Search"} />
      </div>
      <div className="d-flex justify-content-center align-items-center vh-100 mt-10">
        <div className="d-flex flex-row align-items-center text-center">
          <textarea
            value={question}
            cols={50}
            rows={1}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control me-3 bg-richblack-800 px-3 py-2 text-richblack-200 rounded-md"
            placeholder="Ask your question here..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                generateResponse();
              }
            }}
            style={{ resize: "none" }}
          ></textarea>
          <button onClick={generateResponse} className="text-4xl">
            <CgSearchLoading />
          </button>
        </div>
      </div>

      {/* Show spinner while loading */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center mt-5" style={{display:"flex", justifyContent:'center', margin: "center", marginTop: '10rem'}}>
          <img src={Spinner} alt="Loading..." width={30} height={30} />
        </div>
      ) : (
        response && (
          <div
            className="bg-richblack-800 text-black items-center mt-5 mx-auto px-2 py-4 rounded-lg text-richblack-200"
            style={{ width: "80%", height: "50%" }}
          >
            {formatResponse(response)}
          </div>
        )
      )}
    </div>
  );
};

export default Chatbot;