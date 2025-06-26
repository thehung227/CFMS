export class LayoutData{
    public static Layout = [
        {
            key: 'CCM_WidgetTasks',
            text: 'Nhắc việc phê duyệt',
            command: 'usp_Coteccons_sys_TodoList',
            data: {
                grdReport: [
                    {
                        header: 'Loại',
                        binding: 'ImageData',
                        width: 100,
                        dataType: 'string'
                    },
                    {
                        header: 'Cần xử lý',
                        binding: 'Subject',
                        width: 100,
                        dataType: 'number',
                        format:'n0'
                    }
                ],
                parameters: [
                ]
            }
        } 
    ]
}