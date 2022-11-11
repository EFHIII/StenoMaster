# Test
This is an experimental Steno practice program. To use the program, you need a [Plover](https://www.openstenoproject.org/plover/) compatible stenotype and [Plover](https://www.openstenoproject.org/plover/). In Plover, disable all dictionaries when using this program. The program is available at [https://efhiii.github.io/test](https://efhiii.github.io/test)

## About the program
Within the program is currently a single test lesson that serves as a proof-of-concept. It is the only screen you see. Provided development continues, there will later be an interface to choose lessons. When doing a lesson, you use a stenotype to type the text shown. If a mistake is made, the intended stroke(s) will be shown until you correctly stroke the word/phrase.

## Lessons format
The lines of text alternate between being the text that is shown and the steno strokes to produce that text. There is no inherent dictionary.

To produce the steno strokes, just like when using the program itself, it is easiest to use Plover with all dictionaries disabled. When Plover has no dictionaries enabled, it produces RAW steno strokes. (asterisk is still 'undo last stroke')

# How it works
Plover simulates a standard keyboard, so using normal keyboard input makes the gathering of input very straight forward. The only minor issue is that it's not entirely obvious where the end of a stroke is until the next stroke starts. For example, the Stroke `SA` looks like `SAL` where the `L` input just hasn't been sent yet. Fortunately, Plover produces its output very quickly, with an entire stroke of all keys taking less than 1/100th of a second. People typically aren't typing more than 10 strokes per second, so by waiting until there hasn't been any input for more than 1/100th of a second, the end of a stroke can be fairly consistently be identified.
