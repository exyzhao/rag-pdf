import { useState } from 'react'
import axios from 'axios'

import { Box, Button, Card, Container, CssBaseline, Divider, Grid, TextField } from '@mui/material'

const App = () => {
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  // Handler to POST new question and add new answer
  const addQuestion = (event) => {
    event.preventDefault()
    const questionObject = {
      content: newQuestion,
      id: questions.length + 1,
    }

    axios
      .post('http://localhost:8000/api/messages', { question: newQuestion })
      .then(res => {
        setAnswer(res.data)
      })

    setQuestions(questions.concat(questionObject))
    setNewQuestion('')
  }

  // Handler to rePOST old question
  const revisitQuestion = (oldQuestion) => {
    axios
      .post('http://localhost:8000/api/messages', { question: oldQuestion })
      .then(res => {
        setAnswer(res.data)
      })

    setNewQuestion('')
  }

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value)
  }

  return (
    <Container>
      <CssBaseline />
      <h1>Ask your .pdf a question:</h1>
      <Card>
        <Box sx={{ p: 2 }}>
          {answer[0] ? answer[0].response : "Answers take ~2.5 seconds to load..."}
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          Source: {answer[0] ? answer[1].sources : null}
        </Box>
      </Card>
      <ul>
        {questions.map(question =>
          <a href="#" key={question.id} onClick={() => revisitQuestion(question.content)}><li>{question.content}</li></a>
        )}
      </ul>
      <form onSubmit={addQuestion}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField fullWidth
              value={newQuestion}
              onChange={handleQuestionChange}
              id="outlined-search" placeholder='What makes a great founder?' type="search"
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" size="large" sx={{ height: "56px" }}>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default App