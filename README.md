# Introduction
This project is an extensible parser of simple mathematical expressions, designed as a test job for an interview.

<img src="./.github/markups/maintain-warning.svg">

# Formatting expressions
The following text describes the rules of expression formatting when using a DefaultParser and a DefaultExpression.
* > The expressions must follow the general rules for mathematical expressions.
* > Two operators cannot follow each other, if you need to apply an operator to a negative number - place it in brackets.
Examples of **incorrect** expressions
`2++`
`2 + 2 * -1`
Examples of **correct** expressions
`2 + 1`
`2 + 2 * (-1)`
* > The brackets will close automatically if you have not done so.
`2 * (50 - ((8 + 3) * 15 + 2` => `2 * (50 - ((8 + 3) * 15 + 2))`
* > Empty brackets are not allowed. Any brackets must contain at least one number.
Examples of **incorrect** expressions
`()`
`2 - ()`
Examples of **correct** expressions
`(0)`
`2 - (0)`
* > Floating point can be replaced by a comma.
Examples of **correct** expressions
`5.2`
`5,2`
`.2`
`,2`
Examples of **incorrect** expressions
`1,000,000 / 100`
`5. * 10`
* > The multiplication sign before and after a bracket may be skipped.
Examples of **correct** expressions
`2(2 + 2)` => `2 * (2 + 2)`
`2 / (2 + 2)2` => `2 / (2 + 2) * 2`
* > Spaces does not matter and is completely ignored by parser.
`​ ​ ​ 2 ​ + 2 ​` => `2+2`
`2 3 / 2 . 3` => `23/2.3`
