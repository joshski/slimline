# slimline

Lightweight BDD for JavaScript.

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

## Interpreting features

Features are interpreted via a JavaScript module per feature.

Each interpreter module exports a class. Each method of that class corresponds
to a line in the feature file and represents an interaction with the application
via its user interface or API. These methods return promises:

`/features/polls.feature.js`

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

## Executing features

Execute all features with the `slim` command line tool:

```
> slim

Polls

When a poll is created:
✓ Visitors can vote on the poll

When visitors vote on a poll:
✓ Votes are tallied
✓ A chart shows vote distribution

Passed: 1 feature, 2 scenarios, 3 assertions
```

...or run just one feature, scenario, or assertion by name:

```
> slim "Polls"
> slim "When visitors vote on a poll"
> slim "Votes are tallied"
```

...or matching a regular expression:

```
> slim -g tallied
```

## Planning features

Ideas for new features, scenarios and assertions are captured under
`features/ideas/` as headings and bullets, e.g:

`/features/ideas/polls.feature`

```
Polls

When a visitor votes on a poll:
* They cannot vote again

When a poll is closed:
* The tally and chart can still be viewed
* Users who already voted cannot vote
* Users who have not yet voted cannot vote
```

At implementation time, cut and paste headings and bullets from this file into
the appropriate feature file. The `slim` executable will do this for you when
you attempt to execute any idea for a feature, scenario or assertion by name:

```
> slim "When a poll is closed"

Move scenario idea "When a poll is closed" into feature "Polls"? (yes/no)
> yes

Moved scenario "When a poll is closed":
  <- features/ideas/polls.feature (line 12)
  -> features/polls.feature (line 31)
```

## Examples

Sometimes detailed examples help digest combinatorial complexity, illustrate a
process or ensure all permutations of inputs are accounted for.

Slimline does not parse any indented text in feature files, so you can indent
text representing additional documentation, but you can also use it to 
generate scenarios and assertions from an arbitrary format. For example, you
could use the `ascii-table-parser` module to parse a table:

```
Polls

  Polls are voted on by everybody, but managed by a subset of users.

When interacting with polls:

  Logging in as different users affects which actions are allowed.

* Users have different rights:
  | role           | vote?  | create polls?  | close polls?  |
  | Anonymous      | can    | cannot         | cannot        |
  | Authenticated  | can    | can            | cannot        |
  | Administrator  | can    | can            | can           |

```

Indented blocks of text are passed as multi-line string arguments to the
corresponding interpreter methods:

```JavaScript
class Polls {

  constructor(explanation) {
    // explanation equals:
    //   "Polls are voted on by everybody, but managed by a subset of users."
  }

  "When interacting with polls" (explanation) {
    // explanation equals:
    //   "Logging in as different users affects which actions are visible."
    return this.ui.visitPolls();
  }
  
  "Users have different rights" (rightsTableString) {
    // parse the multi-line string
    var table = require('ascii-table-parser').parse(rightsTableString);
    
    // return an array of other assertion names (nested arrays are ok):
    return table.rows.map(row => [
      `${row.role} users ${row['vote?']} vote`,
      `${row.role} users ${row['create poll?']} create polls`s
      `${row.role} users ${row['close poll?']} close polls`
    ]);
  }

  // implement generated assertions one by one:

  "Anonymous users can vote" () {
    return this.api.createPoll()
      .then(poll => this.ui.logOut()
        .then(() => this.ui.voteOnPoll(poll)
        .then(() => this.api.pollShouldHaveTotalVotes(poll, 1))));
  }

  "Administrator users can close polls" () {
    return this.api.createPoll()
      .then(poll => this.ui.loginAsAdministrator()
        .then(() => this.ui.closePoll(poll)
        .then(() => this.api.pollShouldBeClosed(poll))));
  }

}
```

Generated assertions are executed and reported individually:

```

> slim "When interacting with polls"

Polls

  Polls are voted on by everybody, but managed by a subset of users.

When interacting with polls:

  Logging in as different users affects which actions are allowed.

* Users have different rights:
  | role           | vote?  | create polls?  | close polls?  |
  | Anonymous      | can    | cannot         | cannot        |
  | Authenticated  | can    | can            | cannot        |
  | Administrator  | can    | can            | can           |

  ✓ Anonymous users can vote
  ? Anonymous users can create polls
  ? Anonymous users can close polls
  ? Authenticated users can vote
  ? Authenticated users can create polls
  ? Authenticated users can close polls
  ? Administrator users can vote
  ? Administrator users can create polls
  ✓ Administrator users can close polls

Passed: 1 feature, 1 scenario, 2 assertions
Pending: 7 assertions
```
