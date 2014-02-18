# generator-c5

A generator for [Yeoman](http://yeoman.io) which creates CMS Blocks, Packages etc. for [concrete5](http://www.concrete5.org/).

Three block form layouts are supported
- Normal
- Tabs
- Sortable Lists (e.g. for link lists, content sliders etc.)

It depends on external modules for images, texteditor and link checking, which have to be provided.

## Sublime Integration Example
generator-c5.json (or other filename):
```
{
  "cmd": ["grunt", "version"],
  "shell" : "true",
  "variants": [

      { "cmd": ["grunt", "build"],
        "name": "Concrete5 package: Get rid of grunt and cli stuff",
        "shell": true
      },

      { "cmd": ["yo", "c5:block", "test", "$file", "--force"],
        "name": "Create new concrete5 block",
        "working_dir" : "$file_path",
        "shell": true
      }
  ],
  "encoding": "latin1"
}
```
Sublime Build Example:
```
{
  "cmd": ["grunt", "version"],
  "shell" : "true",
  "variants": [

      { "cmd": ["grunt", "build"],
        "name": "Concrete5 package: Get rid of grunt and cli stuff",
        "shell": true
      },

      { "cmd": ["yo", "c5:block", "test", "$file", "--force"],
        "name": "Create new concrete5 block",
        "working_dir" : "$file_path",
        "shell": true
      }
  ],
  "encoding": "latin1"
}
```

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-c5 from npm, run:

```
$ npm install -g generator-c5
```

Finally, initiate the generator:

```
$ yo c5
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
