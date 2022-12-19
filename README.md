# StenoMaster

This is a Steno practice program. To use the program, you need a [Plover](https://www.openstenoproject.org/plover/) compatible stenotype and [Plover](https://www.openstenoproject.org/plover/). In Plover, disable all dictionaries when using this program. The program is available at <https://stenomaster.southcoastcollege.edu/>

## About the program

Within the program, you can do steno lessons. When doing a lesson, you use a stenotype to type the text shown. If a mistake is made, the intended stroke(s) will be shown until you correctly stroke the word/phrase. If `Auto advance` is enabled, you will be progressed to the next lesson after completing the requisite number of repetitions with at least the requisite number of times at or above the requisite accuracy.

## Lessons format

The lines of text alternate between being the text that is shown and the steno strokes to produce that text. There is no inherent dictionary.

You can use [LessonGen](https://github.com/EFHIII/LessonGen) to easily generate lessons from Plover logs, making use of your own Dictionary.

## How it works

Plover simulates a standard keyboard, so detecting strokes just uses normal keyboard events. The only minor issue is that it's not entirely obvious where the end of a stroke is until the next stroke starts. For example, the Stroke `SA` looks like `SAL` where the `L` input just hasn't been sent yet. Fortunately, Plover produces its output very quickly, so by waiting until there hasn't been any input for more than 1/100th of a second, the end of a stroke can be identified fairly consistently.
