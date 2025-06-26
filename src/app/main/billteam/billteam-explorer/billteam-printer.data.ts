export class LayoutPrinter {
    public Layout = [
        {
            'MAU1': `<html>

            <head>
            <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
            <meta name=Generator content="Microsoft Word 15 (filtered)">
            <style>
            
            </style>
            
            </head>
            
            <body lang=EN-US>
            
            <div class=WordSection1>
            
            <table class=MsoTableGrid border=0 cellspacing=0 cellpadding=0
             style='border-collapse:collapse;border:none'>
             <tr style='height:27.35pt'>
              <td width=150 valign=top style='width:112.25pt;padding:0in 5.4pt 0in 5.4pt;
              height:27.35pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'><img
              width=189 height=74 id="Picture 2"
              src="{VAR=Logo}"
              alt="Káº¿t quáº£ hÃ¬nh áº£nh cho coteccons logo"></span></p>
              </td>
              <td width=547 style='width:410.55pt;padding:0in 5.4pt 0in 5.4pt;height:27.35pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:14.0pt;
              font-family:"Times New Roman",serif'>CÔNG TY C&#7892; PH&#7846;N XÂY D&#7920;NG
              COTECCONS</span></b></p>
              </td>
             </tr>
            </table>
            
            <p class=MsoNormal align=center style='text-align:center'><span
            style='font-size:12.0pt;line-height:107%;font-family:"Times New Roman",serif'>&nbsp;</span></p>
            
            <p class=MsoNormal align=center style='text-align:center'><b><span
            style='font-size:15.0pt;line-height:107%;font-family:"Times New Roman",serif'>B&#7842;NG
            KH&#7888;I L&#431;&#7906;NG T&#7840;M &#7912;NG THI CÔNG</span></b></p>
            
            <p class=MsoNormal align=center style='text-align:center'><span
            style='font-size:12.0pt;line-height:107%;font-family:"Times New Roman",serif'>Công
            trình: <b>{VAR=ProductName}</b></span></p>
            
            <p class=MsoNormal align=center style='text-align:center'><span
            style='font-size:12.0pt;line-height:107%;font-family:"Times New Roman",serif'>&#272;&#7897;i
            thi công: <b>{VAR=CustomerName}</b></span></p>
            
            <p class=MsoNormal align=center style='text-align:center'><span
            style='font-size:12.0pt;line-height:107%;font-family:"Times New Roman",serif'>H&#272;
            s&#7889;: <b>{VAR=ParentDocNo}</b> ngày: <b>{VAR=ParentDocDate}</b></span></p>
            
            <p class=MsoNormal><span style='font-size:12.0pt;line-height:107%;font-family:
            "Times New Roman",serif'>{VAR=BravoDetail}</span></p>
            
            <table class=MsoTableGrid border=0 cellspacing=0 cellpadding=0 width=708
             style='width:530.75pt;border-collapse:collapse;border:none'>
             <tr style='height:19.3pt'>
              <td width=708 colspan=3 style='width:530.75pt;padding:0in 5.4pt 0in 5.4pt;
              height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
              color:red'>GIÁ TR&#7882; THANH TOÁN T&#7914;NG K&#7922;</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>1</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>T&#7893;ng
              giá tr&#7883; thi công (không g&#7891;m VAT)</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_ThiCong}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>2</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Giá
              tr&#7883; th&#7921;c hi&#7879;n &#273;&#7871;n k&#7923; này</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_THDenKyNay}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>3</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>T&#7841;m
              &#7913;ng (n&#7871;u có)</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_TamUng}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>4</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Hoàn
              tr&#7843; t&#7841;m &#7913;ng (n&#7871;u có)</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_HoanTra}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>5</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>T&#7893;ng
              giá tr&#7883; &#273;&#432;&#7907;c thanh toán &#273;&#7871;n k&#7923; này ( 5
              ) = (2) + (3) + (4)</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_TongTTDenKyNay}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>6</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>T&#7893;ng
              giá tr&#7883; thanh toán &#273;&#7871;n các k&#7923; tr&#432;&#7899;c</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_TTKyTruoc}</span></b></p>
              </td>
             </tr>
             <tr style='height:19.3pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>7</span></p>
              </td>
              <td width=410 style='width:307.15pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>&#272;&#7873;
              ngh&#7883; thanh toán k&#7923; này (7) = (5) + (6)</span></p>
              </td>
              <td width=270 style='width:202.5pt;padding:0in 5.4pt 0in 5.4pt;height:19.3pt'>
              <p class=MsoNormal align=right style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:right;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>{VAR=Amount_DeNghiTT}</span></b></p>
              </td>
             </tr>
             <tr style='height:28.1pt'>
              <td width=28 style='width:21.1pt;padding:0in 5.4pt 0in 5.4pt;height:28.1pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=680 colspan=2 style='width:509.65pt;padding:0in 5.4pt 0in 5.4pt;
              height:28.1pt'>
              <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
              normal'><i><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>B&#7857;ng
              ch&#7919;: {VAR=AmountInWord}.</span></i></p>
              </td>
             </tr>
            </table>
            
            <p class=MsoNormal><span style='font-size:12.0pt;line-height:107%;font-family:
            "Times New Roman",serif'>&nbsp;</span></p>
        
            
            <table class=MsoTableGrid border=0 cellspacing=0 cellpadding=0
             style='border-collapse:collapse;border:none'>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&#272;&#7896;I THI CÔNG</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>GIÁM SÁT</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>CH&#7880; HUY PHÓ</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>CH&#7880; HUY TR&#431;&#7902;NG</span></b></p>
              </td>
             </tr>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
             <tr style='height:32.85pt'>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt;height:32.85pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt;height:32.85pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt;height:32.85pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt;height:32.85pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
             <tr>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>GS VTTB</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>GS HSES</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><b><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>QS</span></b></p>
              </td>
              <td width=174 style='width:130.7pt;padding:0in 5.4pt 0in 5.4pt'>
              <p class=MsoNormal align=center style='margin-bottom:0in;margin-bottom:.0001pt;
              text-align:center;line-height:normal'><span style='font-size:12.0pt;
              font-family:"Times New Roman",serif'>&nbsp;</span></p>
              </td>
             </tr>
            </table>
            
            <p class=MsoNormal><span style='font-size:12.0pt;line-height:107%;font-family:
            "Times New Roman",serif'>&nbsp;</span></p>
            
            </div>
            
            </body>
            
            </html>
            
        `
        }
    ]
}