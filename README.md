# ERD-Viz-Tool
## Let's make ERDs <label style="color:yellow">Fun</label> again <label style="color:yellow">!</label>

erd-viz-tool is a tool to help create ERD visualizations in a fast & simple manner.

On the left menu you can edit your erd configuration, there are three things you can define:
* A Table
* Columns of each table (use drop down menu to set as Primary/Foreign Key)
* Relationship connections from each column, to any column on any table

**<u>THE STEPS:</u>**
1. Edit your ERD description on the left menu (tables, columns and relationships)
2. Click the 'Generate ERD' button
3. Drag and Drop to edit the layout if needed
4. Save you config file (recommended)


**General notes:**

If the defined relationship table doesn't exist, the relationship won't be created.

If the defined relationship table exist, but the column isn't, the relationship will be connected to the table, not to a specific column.

Download Config File - generated a file with a json object, allowing you to save your ERD locally, for future use.

Upload Config File - allows to upload a config file containing a json object describing your ERD.

Download Image - creates a jpeg file of your ERD visualization.

Contact [Ofer Tovy](https://www.linkedin.com/in/ofer-tovy-b34aa5128) for any questions.


- [The App](https://otovy.github.io/erd-viz/)
- [Git](https://github.com/OTovy/erd-viz)

Have Fun ![](./graphics/favicon.ico)
