import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

// Material-UI
import {
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
} from '@material-ui/core/'
import { makeStyles, useTheme } from '@material-ui/core/styles'

// Material-UI（DatePicker関連）
import DateFnsUtils from '@date-io/date-fns'
import ja from 'date-fns/locale/ja'
import format from 'date-fns/format'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

// React Spreadsheet
import Spreadsheet from 'react-spreadsheet'

// スタイル
const useStyles = makeStyles((theme) => ({
  iframe: {
    width: '100%',
    height: '800px',
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

// スプレッドのデータ
const data = [
  [{value: '商品'}, {value: '単価'}, {value: '数量'}],
  [{value: '産地〆マダイ養殖'}, {value: 100}, {value: ''}],
  [{value: 'アトランティクサーモン養殖'}, {value: 200}, {value: ''}],
  [{value: '活アサリ'}, {value: 300}, {value: ''}],
  [{value: 'カンパチフィレ'}, {value: 400}, {value: ''}],
]
const FaxInput = () => {

  // スタイル・テーマ
  const classes = useStyles()
  const theme = useTheme()

  // ステートフック
  const [nohinbi, setNohinbi] = useState(new Date())

  // 日付変更時
  const doChange = date => {
    if (date !== null) {
      if (date.toString() !== "Invalid Date") {
        setNohinbi(date)
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>FAX見ながら登録</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">FAX見ながら登録</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <iframe src={`${process.env.PUBLIC_URL}/sample.pdf`} className={classes.iframe} />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel id="tokui-label">得意先</InputLabel>
              <Select labelId="tokui-label" value="5343">
                {tokuiList.map(item => (
                  <MenuItem value={item.id}>{item.id} - {item.name}</MenuItem>
                ))}
              </Select>
              <Typography variant="caption" display="block" gutterBottom>
                ※FAX受信元(電話番号等)より得意先を判別して自動選択<br />
                ※後から変更も可能？
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  label="納品日"
                  format="yyyy-MM-dd"
                  locale={ja}
                  value={nohinbi}
                  onChange={doChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <Typography variant="caption" display="block" gutterBottom>
                ※左のFAX画像を見ながら手入力
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Spreadsheet data={data} />
              <Typography variant="caption" display="block" gutterBottom>
                ※当該得意先について、過去（前回）に入力した商品と単価を一覧表示<br />
                ※商品の追加可能<br />
                ※左のFAX画像を見ながら、数量を手入力<br />
                ※単価は変更可能？
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">登録して次のFAXを入力</Button>
              <Typography variant="caption" display="block" gutterBottom>
                ※ログイン中のユーザが担当していて、まだ発注書の入力が完了していないFAXがあれば、続けて入力可能
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default FaxInput