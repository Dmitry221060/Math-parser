# Introduction
This project is an extensible parser of simple mathematical expressions, designed as a test job for an interview.

<img src="./.github/markups/maintain-warning.svg">

# Formatting expressions
The following text describes the rules of expression formatting when using a DefaultParser and a DefaultExpression.
* > The expressions must follow the general rules for mathematical expressions.
* > Two operators cannot follow each other, if you need to apply an operator to a negative number - place it in brackets. <br>
Examples of **incorrect** expressions: <br>
`2++` <br>
`2 + 2 * -1` <br>
Examples of **correct** expressions: <br>
`2 + 1` <br>
`2 + 2 * (-1)` <br>
* > The brackets will close automatically if you have not done so. <br>
`2 * (50 - ((8 + 3) * 15 + 2` => `2 * (50 - ((8 + 3) * 15 + 2))` <br>
* > Empty brackets are not allowed. Any brackets must contain at least one number. <br>
Examples of **incorrect** expressions: <br>
`()` <br>
`2 - ()` <br>
Examples of **correct** expressions: <br>
`(0)` <br>
`2 - (0)` <br>
* > Floating point can be replaced by a comma. <br>
Examples of **correct** expressions: <br>
`5.2` <br>
`5,2` <br>
`.2` <br>
`,2` <br>
Examples of **incorrect** expressions: <br>
`1,000,000 / 100` <br>
`5. * 10` <br>
* > The multiplication sign before and after a bracket may be skipped. <br>
Examples of **correct** expressions: <br>
`2(2 + 2)` => `2 * (2 + 2)` <br>
`2 / (2 + 2)2` => `2 / (2 + 2) * 2` <br>
* > Spaces does not matter and is completely ignored by parser. <br>
`​ ​ ​ 2 ​ + 2 ​` => `2+2` <br>
`2 3 / 2 . 3` => `23/2.3` <br>
