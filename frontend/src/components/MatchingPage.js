import { Box, Button, FormControl, FormControlLabel, FormLabel, LinearProgress, Radio, RadioGroup } from '@mui/material'
import React, { useEffect, useState } from 'react'

function MatchingPage() {
  const [difficulty, setDifficulty] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setTimer(30)
      setTimer((x) => x-1)
    }, 1000);
  }, [])
  

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }

  const handleFindMatch = (e) => {
    e.preventDefault()
    setTimer(30)

    const decrement = setInterval(() => {
      setTimer((x) => x-1)

      if (timer === 0) {
        clearInterval(decrement)
      }
    }, 1000);
  }

  return (
    <Box>
      <form onSubmit={handleFindMatch}>
        <FormControl>
          <FormLabel >Difficulty</FormLabel>
          <RadioGroup
            name="difficulty-selector-group"
            value={difficulty}
            onChange={handleDifficultyChange}
            >
            <FormControlLabel value="easy" control={<Radio />} label="Easy" />
            <FormControlLabel value="medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="hard" control={<Radio />} label="Hard" />
          </RadioGroup>
          <Button type="submit" variant="contained" on>
            Find Match
          </Button>
        </FormControl>
      </form>
      {/* {timer !== 0 &&  */}
      <Box>
        <Box>Finding Match ({timer})</Box>
        <LinearProgress />
      </Box>
    </Box>
  )
}

export default MatchingPage