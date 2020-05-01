import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

// Material-UI
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import Autocomplete from '@material-ui/lab/Autocomplete'

// Material-UI（DatePicker関連）
import DateFnsUtils from '@date-io/date-fns'
import ja from 'date-fns/locale/ja'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

// mui-datatables
import MUIDataTable from 'mui-datatables'

// react-numpad
import NumPad from 'react-numpad'

// GraphQL
import gql from 'graphql-tag'

// Apollo-Client
import { useQuery } from 'react-apollo-hooks'

// スタイル
const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: '20px',
  },
}))

// マスタデータ取得クエリ
const GET_DATA = gql`
  query {

    urisaki(buscd: "0281") {
      AITCD
      MEISJ
      SEISJ
    }

    hinsyu (
      offset: 0
      chunk: 100
    ) {
      HINCD
      HINNM
      SIZEN
      JYURY
    }

  }
`

// 登録済み受注リスト
const detail = [
  {'id': '1', 'name': '産地〆マダイ養殖', 'tanka': 100, 'suryo': 10},
  {'id': '2', 'name': 'アトランティクサーモン養殖', 'tanka': 200, 'suryo': 12},
  {'id': '3', 'name': '活アサリ', 'tanka': 300, 'suryo': 8},
]

// MuiDataTables列定義
const columns = [
  {name: 'name', label: '商品', options: {sort: true, filter: true }}, 
  {name: 'tanka', label: '単価', options: {sort: true, filter: true }}, 
  {name: 'suryo', label: '数量', options: {sort: true, filter: true }}, 
  {name: '修正', 
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

  // ステートフック
  const [nohinbi, setNohinbi] = useState(new Date())
  const [tanka, setTanka] = useState('')
  const [suryo, setSuryo] = useState('')

  // 納品日変更時
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
      setTanka(newval.JYURY)
    }
  } 

  // データ取得
  // fetchPolicy: 'cache-and-network' を指定することで、
  // 画面遷移が起こったタイミングで、キャッシュorネットワークからデータを取得して再表示する
  const { loading, error, data } = useQuery(GET_DATA, {
    fetchPolicy: 'cache-and-network',
  })

  // 通信状態に応じたコンポーネントを表示
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

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
                options={data.urisaki}
                getOptionLabel={(option) => option.AITCD + " - " + option.MEISJ}
                style={{ width: 400 }}
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
                ※得意先・納品日を変更すると、入力されている明細が右側に表示される
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
                options={data.hinsyu}
                getOptionLabel={(option) => option.HINCD + " - " + option.HINNM + " " + option.SIZEN}
                style={{ width: 400 }}
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
          <MUIDataTable data={detail} columns={columns} />
        </Grid>
      </Grid>
    </div>
  )
}

export default ChobaInput