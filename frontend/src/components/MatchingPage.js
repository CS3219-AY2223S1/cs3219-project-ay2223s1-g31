import { Box, Button, FormControl, FormControlLabel, FormLabel, LinearProgress, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'

const Difficulty = {
  EASY:'easy',
  MEDIUM:'medium',
  HARD:'hard',
  NONE:''
}

function MatchingPage() {
  const [difficulty, setDifficulty] = useState(Difficulty.NONE)
  const [isFinding, setIsFinding] = useState(false)
  
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value)
  }

  const handleFindMatch = (e) => {
    e.preventDefault()

    if (difficulty === Difficulty.NONE) {
      // error handling
      return
    }

    setIsFinding(true)
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
            <FormControlLabel value={Difficulty.EASY} control={<Radio />} label="Easy" />
            <FormControlLabel value={Difficulty.MEDIUM} control={<Radio />} label="Medium" />
            <FormControlLabel value={Difficulty.HARD} control={<Radio />} label="Hard" />
          </RadioGroup>
          <Button type="submit" variant="contained" on>
            Find Match
          </Button>
        </FormControl>
      </form>
      {isFinding &&
      <Box>
        <Box>Finding Match ...</Box>
        <LinearProgress />
        <Button onClick={() => setIsFinding(false)}>Cancel</Button>
      </Box>}
    </Box>
  )
}

export default MatchingPage
