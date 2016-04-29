# slimline

Lightweight BDD for JavaScript.

Slimline does BDD just like you are used to, only using a compact syntax for
expressing specifications in natural language, and a more direct binding of that
language onto automation code.

## Features

Headings and bullet points are the syntax of feature files:

`/features/polls.feature`

```
Polls

When a poll is created:
* Visitors can vote on the poll

When visitors vote on a poll:
* Votes are tallied
* A chart shows vote distribution
```

## A module per feature

Features are implemented as JavaScript modules.

Each feature module exports a class. Each method of that class corresponds to
a line in the feature file and represents an interaction with the application
via its user interface or API. These methods return promises:

`/features/polls.js`

```JavaScript
module.exports = class Polls {

  "When a poll is created" () {
    return this.ui.createPoll({
      title: "tastiest?",
      options: [ "Strawberry", "Banana" ]
    });
  }

  "Visitors can vote on the poll" () {
    return this.ui.voteOnPoll("tastiest?", "Banana");
  }
  
  "When visitors vote on a poll" () {
    return this.api.createPoll({
      title: "scariest?",
      options: ["Trolls", "Vampires"]
    })
    .then(() => this.ui.voteOnPoll("scariest?", "Trolls"))
    .then(() => this.ui.voteOnPoll("scariest?", "Vampires"));
  }
  
  "Votes are tallied" () {
    return this.ui.shouldShowPollTally("scariest?", { "Trolls": 1, "Vampires": 1 });
  }

  "A chart shows vote distribution" () {
    return this.ui.shouldShowPollChart("scariest?", { "Trolls": 50, "Vampires": 50 });
  }
}
```

## Execution

Execute all features with `slim`

```
> slim

Polls

When a poll is created:
✓ Visitors can vote on the poll

When visitors vote on a poll:
✓ Votes are tallied
✓ A chart shows vote distribution

Passed: 1 feature, 2 scenarios, 3 expectations
```

...or just one context:

```
> slim "When visitors vote on a poll"

Polls

When visitors vote on a poll:
✓ Votes are aggregated
✓ A chart shows vote distribution

Passed: 1 feature, 1 scenario, 2 expectations
```

...or just one expectation:

```
> slim "Votes are aggregated"

Polls

When visitors vote on a poll:
✓ Votes are aggregated

Passed: 1 feature, 1 scenario, 1 expectation
```

## Workflow

Ideas for new features are captured under `features/ideas.feature` as headings
and bullets, e.g:

`/features/ideas.feature`

```
Polls

When visitors vote on a poll:
* They cannot vote again

When a poll is closed:
* The tally and chart can still be viewed
```

When implementing a feature, cut the headings and bullets from this file and
paste it into the appropriate feature file. The `slimline` executable will do
this for you if you attempt to execute the new scenario or expectation:

```
> slimine "When a poll is closed"

Start working on 2 new scenarios under "When a poll is closed"? (yes/no)
> yes

Added 2 scenarios under "When a poll is closed" to features/polls.js at line 31
```
