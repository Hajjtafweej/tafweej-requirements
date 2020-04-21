<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>قائمة متطلبات {{ $Participant->name }}</title>
  <style type="text/css">
  body {
    height:100%;
    font-size: 16px;
    font-family: 'Frutiger',arial;
  }
  @page {
    margin-bottom: 100px;
  }
  .table {
    widtd: 100%;
    margin-bottom: 0;
  }
  .table td,.table td {
    padding: 0;
  }
  .right {
    float: right;
  }
  .left {
    float: left;
  }
  .mb-0 {
    margin-bottom: 0px !important;
  }
  .mb-1 {
    margin-bottom: 5px !important;
  }
  .mb-2 {
    margin-bottom: 10px !important;
  }
  .vtop {
    vertical-align: top;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .text-danger {
    color: #ea1111;
  }

  /* Table */
  
  .gray-bg {
    background: #e8e8e8;
  }
  .table {
    margin-bottom: 50px;
  }
  .table td {
    font-weight: bold;
    font-size: 16px;
    line-height: 1.6;
    padding: 15px 20px;

  }
  .table .border-bottom td {
    border-bottom: 1px solid #c5c5c5;
  }
  .table-heading th {
    background: #0692a0;
        border-bottom: 1px solid #077e8a;
    color: #fff;
        font-weight: bold;
    font-size: 16px;
    line-height: 1.6;
    padding: 10px 20px;
  }
  .table .border-l {
    border-left: 1px solid #c5c5c5;
  }
  .table .border-r {
    border-right: 1px solid #c5c5c5;
  }
  .table-heading .border-l {
    border-left: 1px solid #077e8a;
  }
  .table .border-t {
    border-top: 1px solid #c5c5c5;
  }

  .table-body-item .no {
    background: #f2f6f9;
  }

  .empty-table {
    text-align: center;
    border:3px solid #cccdd6;
    padding: 20px;
    font-size: 18px;
    color: #74787d;
  }


  /* Custom CSS */
  .page-title {
      text-align: center;
      font-size: 25px;
      margin-bottom: 50px;
      color: #078794;
  }

  .holy-place-title {
      font-size: 20px;
      margin-bottom: 20px;
  }
  /* Labels */
  .labels {
    margin-bottom: 20px;
  }
  .labels .item {
    width: 20%;
    float: right;
    margin-bottom: 20px;
  }
  .labels .item .title {
    margin-bottom: 5px;
  }

</style>
</head>
<body>
      <div class="page-title">
        قائمة متطلبات {{ $Participant->name }} <br> لموسم حج {{ \GeniusTS\HijriDate\Date::today()->format('Y') }} هـ
      </div>
      <div class="labels">
        <div class="item">
          <div class="title">الجهة</div>
          <div class="value">{{ (isset($filterLabels['holy_place_id'])) ? $filterLabels['holy_place_id']->name : 'الكل' }}</div>
        </div>
        <div class="item">
          <div class="title">الموضوع</div>
          <div class="value">{{ (isset($filterLabels['subject_id'])) ? $filterLabels['subject_id']->name : 'الكل' }}</div>
        </div>
        <div class="item">
          <div class="title">الموضوع الفرعي</div>
          <div class="value">{{ (isset($filterLabels['sub_subject_id'])) ? $filterLabels['sub_subject_id']->name : 'الكل' }}</div>
        </div>
        <div class="item">
          <div class="title">المستوى</div>
          <div class="value">{{ (isset($filterLabels['level_id'])) ? $filterLabels['level_id']->name : 'الكل' }}</div>
        </div>
        <div class="item">
          <div class="title">المجال الجغرافي</div>
          <div class="value">{{ (isset($filterLabels['geographical_scope_id'])) ? $filterLabels['geographical_scope_id']->name : 'الكل' }}</div>
        </div>
      </div>
      @if($Requirements->count())
        <div class="table">
          <table cellspacing="0" cellpadding="0">
            <thead class="table-heading">
  <tr>              <th class="border-l border-r text-center no"  style="padding: 10px 20px;"></th>
              <th class="border-l" style="width: 300px">مخرجات نطاق الاعمال</th>
              <th class="border-l" style="width: 300px">المتطلبات</th>
            </tr>
            </thead>
            @if($Requirements->count())
            @foreach($Requirements as $requirementKey => $Requirement)
            <tr class="table-body-item border-bottom">
              <td class="border-l border-r text-center no"  style="widtd: 30px;padding: 10px 0;">R{{ $Requirement->id }}</td>
              <td class="border-l" style="width: 500px">{{ $Requirement->business_scope }}</td>
              <td class="border-l" style="width: 500px">{{ $Requirement->requirements }}</td>
            </tr>
            @endforeach
            @endif
          </table>
        </div>
        @else
        <div class="empty-table">
          لا توجد متطلبات
        </div>
        @endif
</body>
</html>
