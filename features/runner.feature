Runner

When features are executed:
* Prints count of features, scenarios and assertions

When there are pending assertions:
* Prints count of pending assertions

When there are no pending assertions:
* Does not print count of pending assertions

When called with no arguments:
* Executes all features

When called with one argument matching a scenario name:
* Executes all assertions in the matching scenario

When called with one argument matching multiple scenario names:
* Executes all assertions in the matching scenarios

When errors occur:
* Prints the message
* Prints the stack trace
* Prints the location
