# print-job

This small JavaScript library prints a single HTML container.

## Features

* No popup windows or iFrames
* No moving and replacing HTML


## Documentation


### Print a container
```javascript
PrintJob.print('#areaYouWantToPrint');
``` 

You can alternatively pass in an element instead of a selector:
```javascript
let element = document.getElementById('areaYouWantToPrint');
PrintJob.print(element);
```

### Upcoming Features
* Use custom print CSS
* Lifecycle callbacks
    * Before print
    * After print
* Preset jobs (set up the job and print later)
