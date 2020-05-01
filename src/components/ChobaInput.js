import React, { useState, useReducer  } from 'react'
import { Helmet } from 'react-helmet'

// Material-UI
import {
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core/'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import Autocomplete from '@material-ui/lab/Autocomplete'

// Material-UI（DatePicker関連）
import DateFnsUtils from '@date-io/date-fns'
import ja from 'date-fns/locale/ja'
import format from 'date-fns/format'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

// mui-datatables
import MUIDataTable from 'mui-datatables'

// react-numpad
import NumPad from 'react-numpad'

// スタイル
const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: '20px',
  },
}))

// 得意先リスト
const tokuiList = [
  {'id': '10', 'name': '得意先A'},
  {'id': '20', 'name': '得意先B'},
  {'id': '30', 'name': '得意先C'},
  {'id': '5343', 'name': 'XXXXキッチン駒沢店'},
  {'id': '5344', 'name': 'XXXXキッチン○○店'},
  {'id': '5345', 'name': 'XXXXキッチン△△店'},
]

// 商品リスト
const shohinList = [
  {'id': '10', 'name': '産地〆マダイ養殖', 'tanka': 100},
  {'id': '20', 'name': 'アトランティクサーモン養殖', 'tanka': 200},
  {'id': '30', 'name': '活アサリ', 'tanka': 300},
  {'id': '40', 'name': 'カンパチフィレ', 'tanka': 400},
]

// 登録済み受注リスト
const list = [
  {'id': '1', 'name': '産地〆マダイ養殖', 'tanka': 100, 'suryo': 10},
  {'id': '2', 'name': 'アトランティクサーモン養殖', 'tanka': 200, 'suryo': 12},
  {'id': '3', 'name': '活アサリ', 'tanka': 300, 'suryo': 8},
]

// MuiDataTables列定義
const columns = [
  {name: 'name', label: '商品', options: {sort: true, filter: true }}, 
  {name: 'tanka', label: '単価', options: {sort: true, filter: true }}, 
  {name: 'suryo', label: '数量', options: {sort: true, filter: true }}, 
  {name: '詳細', 
    options: {filter: false, sort: false, empty: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <IconButton aria-label="Edit">
            <CreateIcon />
          </IconButton>
        )
      }
    }
  },
]

const ChobaInput = () => {

  // スタイル・テーマ
  const classes = useStyles()
  const theme = useTheme()

  // ステートフック
  const [nohinbi, setNohinbi] = useState(new Date())
  const [tanka, setTanka] = useState('')
  const [suryo, setSuryo] = useState('')

  // 日付変更時
  const doNohinbiChange = date => {
    if (date !== null) {
      if (date.toString() !== "Invalid Date") {
        setNohinbi(date)
      }
    }
  }

  // 商品変更時
  const doShohinChange = (e, newval) => {
    if (newval !== null) {
      setTanka(newval.tanka)
    }
  } 

  return (
    <div>
      <Helmet>
        <title>帳場での受注登録</title>
      </Helmet>
      <Grid container spacing={2} className={classes.title}>
        <Grid item xs={12}>
          <Typography variant="h4">帳場での受注登録</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={tokuiList}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) =>
                  <TextField {...params} label="得意先" />
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  label="納品日"
                  format="yyyy-MM-dd"
                  locale={ja}
                  value={nohinbi}
                  onChange={doNohinbiChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" gutterBottom>
                ※得意先・納品日を変更すると、入力されているリストが表示される
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <hr />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={shohinList}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                onChange={(e, newval) => doShohinChange(e, newval)}
                renderInput={(params) =>
                  <TextField {...params} label="商品" />
                }
              />
              <Typography variant="caption" display="block" gutterBottom>
                ※選択すると単価を自動表示
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <NumPad.Number
                onChange={value => setTanka(value)}
                theme="orange"
                negative={false}
                position="startTopLeft"
                placeholder="Positive"
              >
                <TextField
                  label="単価"
                  value={tanka}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </NumPad.Number>
              <Typography variant="caption" display="block" gutterBottom>
                ※商品を選択すると自動表示（変更可）
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <NumPad.Number
                onChange={value => setSuryo(value)}
                theme="orange"
                negative={false}
                position="startTopLeft"
                placeholder="Positive"
              >
                <TextField
                  label="数量"
                  value={suryo}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </NumPad.Number>
              <Typography variant="caption" display="block" gutterBottom>
                ※手入力
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">登録して次の商品を入力</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <MUIDataTable data={list} columns={columns} />
        </Grid>
      </Grid>
    </div>
  )
}

export default ChobaInput