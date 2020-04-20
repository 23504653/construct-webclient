import { MatPaginatorIntl } from '@angular/material/paginator';


const getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `第 0 条、共 ${length} 条`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `第 ${startIndex + 1} - ${endIndex} 条、共 ${length} 条`;
  };


  export function paginatorCN(){
    const p = new MatPaginatorIntl();
    p.itemsPerPageLabel = '当前页数';
    p.nextPageLabel = '下一页';
    p.previousPageLabel = '上一页';
    p.firstPageLabel = '第一页';
    p.lastPageLabel = '最后一页';
    p.getRangeLabel = getRangeLabel; 
    return p;
}