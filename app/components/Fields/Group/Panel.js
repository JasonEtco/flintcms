import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import serialize from 'form-serialize'
import { openModal } from 'actions/uiActions'
import update from 'immutability-helper'
import Button from 'components/Button'
import camelcase from 'utils/camelcase'
import NewBlockModal from './NewBlockModal'
import mapStateToProps from '../../../main'
import FieldColumn from './FieldColumn'
import GroupTile from './GroupTile'
import './Panel.scss'

class Panel extends Component {
  static propTypes = {
    blocks: PropTypes.objectOf(PropTypes.shape({
      name: PropTypes.string,
      handle: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        handle: PropTypes.string,
        type: PropTypes.string,
        instructions: PropTypes.string,
        required: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['true', 'false', ''])]),
        options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string])
      }))
    })),
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static defaultProps = {
    blocks: {}
  }

  constructor (props) {
    super(props)
    this.newBlockType = this.newBlockType.bind(this)
    this.addBlockType = this.addBlockType.bind(this)
    this.deleteBlock = this.deleteBlock.bind(this)
    this.changeBlockType = this.changeBlockType.bind(this)
    this.changeField = this.changeField.bind(this)
    this.newField = this.newField.bind(this)
    this.saveField = this.saveField.bind(this)
    this.deleteField = this.deleteField.bind(this)
    this.fieldTitleChange = this.fieldTitleChange.bind(this)

    this.state = {
      blocks: props.blocks,
      currentBlock: null,
      currentField: 0
    }
  }

  addBlockType (block) {
    this.setState({
      blocks: {
        ...this.state.blocks,
        [block.name]: block
      },
      currentBlock: block.name,
      currentField: 0
    })
  }

  newBlockType () {
    this.props.dispatch(openModal(<NewBlockModal confirm={this.addBlockType} />))
  }

  deleteBlock (blockHandle) {
    const { blocks, currentBlock } = this.state
    const newBlocks = { ...blocks }
    delete newBlocks[blockHandle]

    this.setState({
      blocks: newBlocks,
      currentBlock: currentBlock === blockHandle ? null : currentBlock,
      currentField: 0
    })
  }

  changeBlockType (currentBlock) {
    this.setState({ currentBlock, currentField: 0 })
  }

  fieldTitleChange (title) {
    const { blocks, currentBlock, currentField } = this.state
    this.setState({
      blocks: {
        ...blocks,
        [currentBlock]: {
          ...blocks[currentBlock],
          fields: [
            ...blocks[currentBlock].fields.slice(0, currentField),
            update(blocks[currentBlock].fields[currentField], {
              $merge: {
                label: title || 'Blank',
                handle: camelcase(title) || 'blank'
              }
            }),
            ...blocks[currentBlock].fields.slice(currentField + 1)
          ]
        }
      },
      currentField
    })
  }

  saveField (reset = true, data) {
    return new Promise((resolve, reject) => {
      const { currentField, blocks, currentBlock } = this.state
      if (reset) this.fieldColumn.form.reset()

      const d = data || serialize(this.fieldColumn.form, { hash: true, empty: true })

      if (!d) reject()
      this.setState({
        blocks: {
          ...blocks,
          [currentBlock]: {
            ...blocks[currentBlock],
            fields: [
              ...blocks[currentBlock].fields.slice(0, currentField),
              update(blocks[currentBlock].fields[currentField], { $merge: { ...d, label: d.title || 'Blank' } }),
              ...blocks[currentBlock].fields.slice(currentField + 1)
            ]
          }
        }
      }, resolve)
    })
  }

  changeField (currentField = this.state.currentField) {
    return this.saveField(false).then(() => {
      this.setState({
        currentField
      })
    })
  }

  newField () {
    const { blocks, currentBlock } = this.state
    const field = {
      label: 'Blank',
      handle: `blank-${blocks[currentBlock].fields.length}`
    }

    this.saveField()
      .then(() => {
        this.setState({
          blocks: {
            ...blocks,
            [currentBlock]: {
              ...blocks[currentBlock],
              fields: [
                ...blocks[currentBlock].fields,
                ...field
              ]
            }
          }
        }, () => {
          this.setState({
            currentField: blocks[currentBlock].fields.length
          })
        })
      })
  }

  deleteField () {
    const { blocks, currentBlock, currentField } = this.state
    this.saveField().then(() => {
      this.setState({
        currentField: 0,
        blocks: {
          ...blocks,
          [currentBlock]: {
            ...blocks[currentBlock],
            fields: [
              ...blocks[currentBlock].fields.slice(0, currentField),
              ...blocks[currentBlock].fields.slice(currentField + 1)
            ]
          }
        }
      })
    })
  }

  render () {
    const { currentBlock, currentField, blocks } = this.state
    const { name: fieldName } = this.props
    const block = blocks[currentBlock]
    const field = block && block.fields.length > 0 ? block.fields[currentField] : {}

    return (
      <div className='panel'>
        <div className='panel__col'>
          <h3 className='panel__col__title'>Block Types</h3>
          <div className='panel__col__inner'>
            {Object.keys(blocks).length > 0 && Object.keys(blocks).map(blockKey => (
              <GroupTile
                key={blockKey}
                isActive={currentBlock === blockKey}
                onClick={() => this.changeBlockType(blockKey)}
                label={blockKey}
                onDelete={this.deleteBlock}
              />))}
            <Button small onClick={this.newBlockType}>New Block Type</Button>
          </div>
        </div>

        <div className='panel__col'>
          <h3 className='panel__col__title'>Fields</h3>
          <div className='panel__col__inner'>
            {currentBlock !== null &&
              <div>
                {block.fields.map((f, i) => (
                  <GroupTile
                    key={f.handle}
                    isActive={currentField === i}
                    onClick={() => this.changeField(i)}
                    label={f.label}
                    handle={f.handle}
                  />))}
                <Button small onClick={this.newField}>New Field</Button>
              </div>
            }
          </div>
        </div>

        <div className='panel__field-layout'>
          <h3 className='panel__col__title'>Fields</h3>
          {currentBlock !== null && currentField !== null && (
            <FieldColumn
              key={currentField}
              ref={(r) => { this.fieldColumn = r }}
              field={field}
              onTitleChange={this.fieldTitleChange}
              deleteField={this.deleteField}
              dispatch={this.props.dispatch}
              canDelete={block.fields.length > 1}
              save={() => this.saveField(false)}
            />
          )}
        </div>

        <div>
          {Object.keys(blocks).map(b => (
            <div key={b}>
              {blocks[b].fields.map((fieldObj, i) => (
                <div key={fieldObj.handle}>
                  {Object.keys(fieldObj).map((key) => {
                    const s = fieldObj[key]
                    return (
                      <input
                        key={key}
                        type='text'
                        hidden
                        readOnly
                        name={`${fieldName}[${b}][fields][${i}][${key}]`}
                        value={typeof s === 'string' ? s : JSON.stringify(s)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Panel)
