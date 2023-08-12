import { Question } from '@prisma/client'
import React from 'react'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '../ui/table'

type Props = {
    questions: Question[]
}

export default function QuestionList({ questions }: Props) {
  let gameType = questions[0].questionType;

  return (
    <Table className='mt-4 '>
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[10px]'>No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>
          <TableHead>Correct Answer</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
          <>
            {questions.map((question,index) => {
                const encodedString = question?.question;
                const decodedString = encodedString
                  ?.replace(/&quot;/g, '"')
                  ?.replace(/&#039;/g, "'");
              
              return (
                <TableRow key={index}>
                  <TableHead className='w-[20px]'>{index+1}</TableHead>
                  <TableHead className='text-sm'>{decodedString}</TableHead>
                  <TableHead className='text-sm'>{question?.userAnswer}</TableHead>
                  <TableHead className='text-sm'>{question?.answer}</TableHead>
                </TableRow>
              )
            })}
          </>
      </TableBody>
    </Table>
  )
}