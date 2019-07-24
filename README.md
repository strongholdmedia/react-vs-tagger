# React VS Tagger

React VS Tagger is a simple tagging component ready to drop in your React projects.
Originally based on the [React Tag Autocomplete project](https://github.com/i-like-robots/react-tag-autocomplete) by Matt Hinchliffe.
Forked due to multiple reasons, namely:

* I supposed it were hard to argue for the original modification goal of making the input optional
* "Standard JS" is completely unacceptable for me as any collaboration basis

Feel free to merge/cherry pick/whatever anything back to any predecessor/parent project.

Project strives to maintain compatibility with :
* ES5
* Preact / Preact-Compat / PreactX
* Non-Node runtimes (for usage)

**Documentation is awkward / unlinted at the moment. Please bear with me while I fix it.**

## Installation

This is a Javascript module available through the [npm] registry. Before installing, download and install Node.js.

Installation using [npm]:

```
npm install --save @dorgaren/react-vs-tagger
```
Using [yarn]:

```
yarn add @dorgaren/react-vs-tagger
```

(this is untested but should work)

[npm]: https://www.npmjs.com
[yarn]: https://yarnpkg.com

## Usage

Here's a sample implementation that initializes the component with a list of preselected `tags` and a `suggestions` list. For further customization details, see [options](#options).

```js
import React from "react";
import Tagger from "@dorgaren/react-vs-tags";

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            tags: [
                { id: 1, name: "Apples" },
                { id: 2, name: "Pears" }
            ],
          suggestions: [
                { id: 3, name: "Bananas" },
                { id: 4, name: "Mangos" },
                { id: 5, name: "Lemons" },
                { id: 6, name: "Apricots" }
            ]
        };
    }

    handleDelete(index)
    {
        const tags = this.state.tags.slice(0);
        tags.splice(index, 1);
        this.setState({ tags });
    }

    handleAddition(tag)
    {
        const tags = [].concat(this.state.tags, tag);
        this.setState({ tags });
    }

    render()
    {
        return (
            <Tagger
                tags={ this.state.tags }
                suggestions={ this.state.suggestions }
                handleDelete={ this.handleDelete.bind(this) }
                handleAddition={ this.handleAddition.bind(this) }
            />
        );
    }
}

React.render(<App />, document.getElementById('app'));
```

### Options

- [`tags`](#tags-optional)
- [`suggestions`](#suggestions-optional)
- [`suggestionsFilter`](#suggestionsfilter-optional)
- [`placeholder`](#placeholder-optional)
- [`autofocus`](#autofocus-optional)
- [`autoresize`](#autoresize-optional)
- [`delimiters`](#delimiters-optional)
- [`delimiterChars`](#delimiterschars-optional)
- [`minQueryLength`](#minquerylength-optional)
- [`maxSuggestionsLength`](#maxsuggestionslength-optional)
- [`classNames`](#classnames-optional)
- [`handleAddition`](#handleaddition-optional)
- [`handleDelete`](#handledelete-optional)
- [`handleInputChange`](#handleinputchange-optional)
- [`handleFocus`](#handlefocus-optional)
- [`handleBlur`](#handleblur-optional)
- [`handleValidate`](#handlevalidate-optional)
- [`addOnBlur`](#addonblur-optional)
- [`allowNew`](#allownew-optional)
- [`allowBackspace`](#allowbackspace-optional)
- [`clearInputOnDelete`](#clearinputondelete-optional)
- [`tagComponent`](#tagcomponent-optional)
- [`inputAttributes`](#inputAttributes-optional)

#### tags (optional)

An array of selected tags. Each tag is an object which must have an `id` and a `name` property. Defaults to `[]`.

```js
const tags =  [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Pears' }
];
```

#### suggestions (optional)

An array of tag suggestions. Each suggestion is an object which must have an `id` and a `name` property and an optional `disabled` property to make the suggestion non-selectable. Defaults to `[]`.

```js
const suggestions = [
  { id: 3, name: 'Bananas' },
  { id: 4, name: 'Mangos' },
  { id: 5, name: 'Lemons' },
  { id: 6, name: 'Apricots', disabled: true }
]
```

#### suggestionsFilter (optional)

A callback function to filter suggestion items with. The callback receives two arguments; a `suggestion` and the current `query` and must return a boolean value.

If no function is supplied the default filter is applied. Defaults to `null`.

#### placeholder (optional)

The placeholder string shown for the input. Defaults to `'Add new tag'`.

#### autofocus (optional)

Boolean parameter to control whether the text-input should be autofocused on mount. Defaults to `true`.

#### autoresize (optional)

Boolean parameter to control whether the text-input should be automatically resized to fit its value. Defaults to `true`.

#### delimiters (optional)

An array of numbers matching `KeyboardEvent.keyCode` values. When a corresponding key is pressed it will trigger tag selection or creation. Defaults to `[9, 13]` (Tab and return keys).

#### delimiterChars (optional)

Array of characters matching `KeyboardEvent.key` values. This is useful when needing to support a specific character irrespective of the keyboard layout. Defaults to `[]`.

#### minQueryLength (optional)

Minimum query length required to show the suggestions list. Defaults to `2`.

#### maxSuggestionsLength (optional)

Maximum number of suggestions to display. Defaults to `6`.

#### classNames (optional)

Override the default class names used by the component. Defaults to:

```js
{
  root: 'react-tags',
  rootFocused: 'is-focused',
  selected: 'react-tags__selected',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled'
}
```

#### handleAddition (required)

Function called when the user wants to add a tag. Receives the tag.

```js
function handleAddition(tag) {
  const tags = [...this.state.tags, tag]
  this.setState({ tags })
}
```

#### handleDelete (required)

Function called when the user wants to delete a tag. Receives the tag index.

```js
function handleDelete(i) {
  const tags = this.state.tags.slice(0)
  tags.splice(i, 1)
  this.setState({ tags })
}
```

#### handleInputChange (optional)

Optional event handler when the input value changes. Receives the current query.

```js
function handleInputChange(query) {
  if (!this.state.busy) {
    this.setState({ busy: true })

    return fetch(`query=${query}`).then((result) => {
      this.setState({ busy: false })
    })
  }
}
```

#### handleFocus (optional)

Optional callback function for when the input receives focus. Receives no arguments.

#### handleBlur (optional)

Optional callback function for when focus on the input is lost. Receives no arguments.

#### handleValidate (optional)

Optional validation function that determines if tag should be added. Receives the tag object and must return a boolean.

```js
function handleValidate(tag) {
  return tag.name.length >= 5;
}
```

#### addOnBlur (optional)

Creates a tag from the current input value when focus on the input is lost. Defaults to `false`.

#### allowNew (optional)

Enable users to add new (not suggested) tags. Defaults to `false`.

#### allowBackspace (optional)

Enable users to delete selected tags when backspace is pressed while focussed on the text input when empty. Defaults to `true`.

#### clearInputOnDelete (optional)

Clear the text input when a tag is deleted. Defaults to `true`.

#### tagComponent (optional)

Provide a custom tag component to render. Defaults to `null`.

#### inputAttributes (optional)

An object containing additional attributes that will be applied to the text input. _Please note_ that this prop cannot overwrite existing attributes, it can only add new ones. Defaults to `{}`.


### Styling

It is possible to customize the appearance of the component, the included styles found in `/example/styles.css` are only an example.


### Development

The component is written in ES6 and uses [Webpack](http://webpack.github.io/) as its build tool.

```
npm install
npm run dev # open http://localhost:8080
```


### Upgrading from 4.x to 5.x

1. The `delimiters` option has been removed, any references to this will now be ignored.
2. The `classNames` option has been updated:

  ```udiff
  {
  -  root: 'ReactTags',
  -  tagInput: 'ReactTags__tagInput',
  -  selected: 'ReactTags__selected',
  -  tag: 'ReactTags__tag',
  -  tagName: 'ReactTags__tagName',
  -  suggestions: 'ReactTags__suggestions',
  -  isActive: 'is-active',
  -  isDisabled: 'is-disabled'
  +  root: 'react-tags',
  +  rootFocused: 'is-focused',
  +  selected: 'react-tags__selected',
  +  selectedTag: 'react-tags__selected-tag',
  +  selectedTagName: 'react-tags__selected-tag-name',
  +  search: 'react-tags__search',
  +  searchInput: 'react-tags__search-input',
  +  suggestions: 'react-tags__suggestions',
  +  suggestionActive: 'is-active',
  +  suggestionDisabled: 'is-disabled'
  }
  ```

For smaller changes refer to [the changelog](CHANGELOG.md).
